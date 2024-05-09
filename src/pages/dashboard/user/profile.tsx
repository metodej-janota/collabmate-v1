import withAuth from "../../../supabase/protectedRoutes";

function Profile() {
  return (
    <>
      <p>Profil</p>
      <p>Protected</p>
    </>
  );
}

export default withAuth(Profile);
