import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [backendError, setBackendError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBackendError(null);

    try {
      const res = await axios.post("http://localhost:3333/auth/login", {
        username,
        password,
      });

      if (res.status !== 200) {
        setBackendError("Credenciais inválidas");
        return;
      }

      login(res.data.token);
      navigate("/enquetes");
    } catch (err) {
      setBackendError("Erro de conexão com o servidor");
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleLogin}>
            <Input
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {backendError && (
              <p className="text-red-600 text-sm">{backendError}</p>
            )}

            <Button className="w-full" type="submit">
              Entrar
            </Button>

            <a
              href="/register"
              className="block text-center text-sm text-blue-600 mt-2"
            >
              Criar conta
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
