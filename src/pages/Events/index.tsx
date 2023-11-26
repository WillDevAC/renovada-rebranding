import { useQuery } from "react-query";
import { Button } from "../../components/Button";
import { EventCard } from "../../components/Cards/Event";
import { Layout } from "../../components/Layout";

import * as S from "./styles";
import api from "../../services/api";

export const EventsPage = () => {
  const GET_EVENTS_LIST = async () => {
    const response = await api.get(`/event`);
    return response.data.events;
  };

  const { data, isLoading } = useQuery("getEventList", GET_EVENTS_LIST);

  return (
    <Layout>
      <S.ActionsEvents>
        <h1>Eventos</h1>
        <S.Actions>
          <Button variant="default">Cadastrar evento</Button>
        </S.Actions>
      </S.ActionsEvents>
      <S.EventsWrapper>
        {isLoading && <span>Carregando eventos...</span>}

        {!isLoading && data.length < 0 && (
          <span>Não há eventos cadastrados.</span>
        )}

        {!isLoading &&
          data.length > 0 &&
          data.map(
            (event: any) =>
              event.img && (
                <EventCard
                  key={event.id}
                  title={event.title}
                  date={event.labelDate}
                  image={event.img.url}
                  id={event.id}
                />
              )
          )}
      </S.EventsWrapper>
    </Layout>
  );
};
