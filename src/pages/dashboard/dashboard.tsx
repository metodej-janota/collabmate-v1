import withAuth from "../../supabase/protectedRoutes";

function Dashboard() {
  return (
    <>
      <p>Profil</p>
      <p>Protected</p>
    </>
  );
}

export default withAuth(Dashboard);
