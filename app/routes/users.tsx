import type { Route } from "./+types/users";
import { prisma } from "../lib/db.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  if (url.searchParams.get("seed") === "true") {
    await prisma.user.createMany({
      data: [
        { email: "walter@example.com", name: "Walter Silva" },
        { email: "admin@example.com", name: "Admin" },
      ],
      skipDuplicates: true,
    });
  }

  const users = await prisma.user.findMany({
    include: { posts: true },
    orderBy: { createdAt: "desc" },
  });

  return { users };
}

export default function Users({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;

  return (
    <div style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <h1>Users ({users.length})</h1>

      {users.length === 0 ? (
        <p>
          Nenhum usuario. <a href="/users?seed=true">Criar usuarios de teste</a>
        </p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> — {user.email}
              <br />
              <small>Criado em: {new Date(user.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      <hr />
      <p>
        <a href="/">Home</a>
      </p>
    </div>
  );
}
