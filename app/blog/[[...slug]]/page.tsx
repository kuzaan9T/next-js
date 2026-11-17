export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;

  return (
    <main>
      <h1>You visited: /{slug.join("/")}</h1>
    </main>
  );
}
