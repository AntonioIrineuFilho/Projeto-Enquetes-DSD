import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [backendError, setBackendError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);
    setSuccess(false);

    const res = await fetch("http://localhost:3334/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setBackendError(data.error || data.message || JSON.stringify(data));
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Registre-se</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleRegister}>
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

            {success && (
              <p className="text-green-600 text-sm">
                Conta criada! Vá para o login.
              </p>
            )}

            <Button className="w-full" type="submit">
              Registrar
            </Button>

            <a
              href="/"
              className="block text-center text-sm text-blue-600 mt-2"
            >
              Já possui conta? Entrar
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
