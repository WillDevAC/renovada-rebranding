import { Layout } from "../../components/Layout";
import { useAuthStore } from "../../stores/auth.store";

export const DashboardPage = () => {
  const authStore = useAuthStore();
  const user = authStore.getUser();

  return (
    <>
      <Layout>
        <h1>Olá, {user.name}</h1>
        <span>Você está logado como {user.roles}</span>
      </Layout>
    </>
  );
};
