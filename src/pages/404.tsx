export default function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="m-auto text-center gap-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl">
          404: Not found
        </h1>
        <p className="text-xl text-muted-foreground">
          You just hit a route that doesn&#39;t exist... the sadness.
        </p>
      </div>
    </div>
  );
}
