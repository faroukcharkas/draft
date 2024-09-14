import { getUserDocuments } from "./actions";
import Link from "next/link";

export default async function Home() {
  const documents = await getUserDocuments();

  return (
    <div>
      <h1>Home</h1>
      {documents && documents.length > 0 ? (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <Link href={`/document/${doc.id}`}>{doc.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>None</p>
      )}
    </div>
  );
}
