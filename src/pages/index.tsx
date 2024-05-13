export default function Home() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="m-auto text-center gap-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl">
            CollabMate
          </h1>
          <p className="text-xl text-muted-foreground">
            A modal dialog that interrupts the user with important content and
            expects a response.
          </p>
        </div>
      </div>
    </>
  );
}
