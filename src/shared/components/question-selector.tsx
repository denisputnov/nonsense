'use client';

import {Question, QuestionsListKey} from '@/shared/questions';
import {Select, SelectItem, SharedSelection} from '@heroui/react';
import {usePulsarState, useSyncPulsarState} from '@/shared/pulsar';

export const QuestionSelector = () => {
  const sync = useSyncPulsarState();
  const {sessionData} = usePulsarState();

  const onSelect = (selection: SharedSelection) => {
    if (!selection.currentKey) return;

    sync(data => {
      data.questionsListKey = selection.currentKey as QuestionsListKey;

      return data;
    });
  };

  return (
    <Select
      label="Набор вопросов"
      placeholder="Выберите набор вопросов"
      selectionMode="single"
      selectedKeys={sessionData?.questionsListKey ? [sessionData.questionsListKey] : []}
      onSelectionChange={onSelect}
    >
      {Object.entries(Question).map(([key, meta]) => (
        <SelectItem color="success" variant="flat" key={key}>
          {meta.name}
        </SelectItem>
      ))}
    </Select>
  );
};
