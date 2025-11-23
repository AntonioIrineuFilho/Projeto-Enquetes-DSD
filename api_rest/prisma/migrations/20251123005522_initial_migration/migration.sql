-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Enquete" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME NOT NULL,
    "criador_id" INTEGER NOT NULL,
    CONSTRAINT "Enquete_criador_id_fkey" FOREIGN KEY ("criador_id") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Opcao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texto" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "enquete_id" INTEGER NOT NULL,
    CONSTRAINT "Opcao_enquete_id_fkey" FOREIGN KEY ("enquete_id") REFERENCES "Enquete" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Voto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "opcao_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Voto_opcao_id_fkey" FOREIGN KEY ("opcao_id") REFERENCES "Opcao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Voto_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");
