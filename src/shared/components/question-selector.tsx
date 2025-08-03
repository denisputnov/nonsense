'use client';

import {Question, QuestionsListKey} from '@/shared/questions';
import {Select, SelectItem, SharedSelection} from '@heroui/react';
import {usePulsarState, useSyncPulsarState} from '../lib/pulsar';

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
        <SelectItem color="success" variant="flat" key={key} textValue={meta.name}>
          <div className="flex flex-col gap-1">
            <p className="text-medium">{meta.name}</p>
            <p className="opacity-60 text-sm">{meta.description}</p>
          </div>
        </SelectItem>
      ))}
    </Select>
  );
};
