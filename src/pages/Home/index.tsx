import { Play, HandPalm } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { FormProvider } from "react-hook-form";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";

export function Home() {
  const { createNewCycle, interruptCurrentCycle, activeCycle } =
    useContext(CyclesContext);

  type NewCycleFormData = zod.infer<typeof newCycleFormValidation>;

  const newCycleFormValidation = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(5).max(60),
  });

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidation),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch("task");
  const isSubmitDisabled = !task;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
