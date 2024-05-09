import withAuth from "../../../supabase/protectedRoutes";

function Settings() {
  return (
    <>
      <p>Profil</p>
      <p>Protected</p>
    </>
  );
}

export default withAuth(Settings);
