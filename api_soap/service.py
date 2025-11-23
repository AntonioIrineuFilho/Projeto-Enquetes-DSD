from spyne import Application, rpc, ServiceBase, Unicode, Array, ComplexModel, Fault
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
from wsgiref.simple_server import make_server
import sqlite3

# tipos do XML (não necessariamente o que tem no banco, mas o que deve exsitir dentro do XML)
# o SOAP precisa de especificação de quais dados são de output e quais são de input(por isso o id só aparece nas classes de output)

class ChoiceOutput(ComplexModel):
    id = Unicode
    title = Unicode
    votes = Unicode

class EnqueteOutput(ComplexModel):
    id = Unicode
    title = Unicode
    description = Unicode
    start_date = Unicode
    end_date = Unicode
    choices = Array(ChoiceOutput)

class ChoiceInput(ComplexModel):
    title = Unicode

class EnqueteInput(ComplexModel):
    title = Unicode
    description = Unicode
    end_date = Unicode
    choices = Array(ChoiceInput)

class EnqueteInputUpdate(ComplexModel):
    title = Unicode
    description = Unicode
    end_date = Unicode    

class VotePercent(ComplexModel):
    choice = ChoiceOutput
    percent = Unicode

class VotesCount(ComplexModel):
    choices = Array(VotePercent)


# métodos possíveis de serem chamados na requisição (CRUD + estatísticas)
class EnqueteService(ServiceBase): 
    # primeiro parâmetro do rpc é a entrada do XML, e o returns explicita a saída do método
    @rpc(EnqueteInput, _returns=Unicode, _in_header=(AuthHeader,))
    def createEnquete(ctx, enquete): # ctx = context = dados da requisição como tipos, operações, autenticação (com exceção dos dados do corpo)
        connection = sqlite3.connect("enquetes_db") # conectar ao banco
        connection.execute("PRAGMA foreign_keys = ON") 
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO enquetes (title, description, end_date) 
            VALUES (?, ?, ?)
        """, (enquete.title, enquete.description, enquete.end_date))
        enquete_id = cursor.lastrowid
        for choice in enquete.choices:
            cursor.execute("""
                INSERT INTO choices (title, enquete_id)
                VALUES (?, ?)
            """, (choice.title, enquete_id))
        connection.commit()
        connection.close()
        return str(enquete_id)

    @rpc(Unicode, _returns=EnqueteOutput, _in_header=(AuthHeader,))
    def detailEnquete(ctx, enquete_id):
        connection = sqlite3.connect("enquetes_db")
        connection.execute("PRAGMA foreign_keys = ON") 
        cursor = connection.cursor()
        cursor.execute("""
            SELECT * 
            FROM enquetes 
            WHERE id=?
        """, (enquete_id,)) # a vírgula é porque precisa ser uma tupla
        enquete = cursor.fetchone() # retorna uma tupla com cada atributo da instância
        if not (enquete):
            raise Fault(faultcode="Client", faultstring="Enquete não encontrada")
        cursor.execute("""
            SELECT * 
            FROM choices 
            WHERE enquete_id=?
        """, (enquete_id,))
        choices = cursor.fetchall() # retorna lista de tuplas
        connection.close()

        choices_output = list()

        for choice in choices:
            choices_output.append(ChoiceOutput(id=str(choice[0]), title=choice[1], votes=str(choice[2])))

        return EnqueteOutput(
            id=str(enquete[0]),
            title=enquete[1],
            description=enquete[2],
            start_date=enquete[3],
            end_date=enquete[4],
            choices=choices_output
        )
    
    @rpc(Unicode, EnqueteInputUpdate, _returns=Unicode, _in_header=(AuthHeader,))
    def updateEnquete(ctx, enquete_id, enquete):
        connection = sqlite3.connect("enquetes_db")
        connection.execute("PRAGMA foreign_keys = ON") 
        cursor = connection.cursor()
        cursor.execute("""
            SELECT * 
            FROM enquetes 
            WHERE id=?
        """, (enquete_id,))
        if not (cursor.fetchone()):
            raise Fault(faultcode="Client", faultstring="Enquete não encontrada")
        cursor.execute("""
            UPDATE enquetes 
            SET title=?, description=?, end_date=?
            WHERE id=?
        """, (enquete.title, enquete.description, enquete.end_date, enquete_id))
        connection.commit()
        connection.close()

        return "OK"
    
    @rpc(Unicode, _returns=Unicode, _in_header=(AuthHeader,))
    def deleteEnquete(ctx, enquete_id):
        connection = sqlite3.connect("enquetes_db") 
        connection.execute("PRAGMA foreign_keys = ON") 
        cursor = connection.cursor()
        cursor.execute("""
            SELECT * FROM enquetes WHERE id=?
        """, (enquete_id,))
        if not (cursor.fetchone()):
            raise Fault(faultcode="Client", faultstring="Enquete não encontrada")
        cursor.execute("""
            DELETE
            FROM enquetes
            WHERE id=?
        """, (enquete_id,))
        connection.commit()
        connection.close()

        return "OK"
    
    @rpc(Unicode, _returns=Unicode, _in_header=(AuthHeader,))
    def voteChoice(ctx, choice_id):
        connection = sqlite3.connect("enquetes_db")
        connection.execute("PRAGMA foreign_keys = ON") 
        cursor = connection.cursor()
        cursor.execute("""
            SELECT *
            FROM choices
            WHERE id=?
        """, (choice_id,))
        choice_selected = cursor.fetchone()
        if not (choice_selected):
            raise Fault(faultcode="Client", faultstring="Escolha não encontrada")
        cursor.execute("""
            UPDATE choices
            SET votes=?
            WHERE id=?
        """, (choice_selected[2]+1, choice_id))
        connection.commit()
        connection.close()

        return "OK"
    
    @rpc(Unicode, _returns=VotesCount, _in_header=(AuthHeader,))
    def votesCount(ctx, enquete_id):
        connection = sqlite3.connect("enquetes_db")  
        connection.execute("PRAGMA foreign_keys = ON")  
        cursor =  connection.cursor()
        cursor.execute("""
            SELECT *
            FROM choices
            WHERE enquete_id=?
        """, (enquete_id,))
        choices_selected = cursor.fetchall()
        connection.close()
        total_votes = 0
        choices_count = list()
        for choice in choices_selected:
            total_votes += choice[2]
        for choice in choices_selected:
            if not (total_votes == 0):
                percent = f"{((choice[2] * 100) / total_votes):.1f}%"
            else:
                percent = 0
            vote_percent = VotePercent(choice=ChoiceOutput(id=str(choice[0]), title=choice[1], votes=str(choice[2])), percent=str(percent))
            choices_count.append(vote_percent)
        
        return VotesCount(choices=choices_count)

application = Application(
    [EnqueteService],
    tns='soap.test',
    in_protocol=Soap11(validator='lxml'),
    out_protocol=Soap11()
)

wsgi_app = WsgiApplication(application)

if __name__ == '__main__':
    server = make_server('0.0.0.0', 8000, wsgi_app)
    print("Rodando serviço SOAP em http://localhost:8000")
    server.serve_forever()
        



        