'use client';

import {Select, SelectItem, SharedSelection} from '@heroui/react';
import {usePulsarState, useSyncPulsarState} from '@/shared/pulsar';
import {FinalStoryShuffle, FinalStoryShuffleStrategy} from '@/shared/final-story-shuffle';

export const ShuffleStrategySelector = () => {
  const sync = useSyncPulsarState();
  const {sessionData} = usePulsarState();

  const onSelect = (selection: SharedSelection) => {
    if (!selection.currentKey) return;

    sync(data => {
      data.finalStoryShuffleStrategy = selection.currentKey as FinalStoryShuffleStrategy;

      return data;
    });
  };

  return (
    <Select
      label="Формирование историй"
      placeholder="Выберите стратегию"
      selectionMode="single"
      selectedKeys={sessionData?.finalStoryShuffleStrategy ? [sessionData.finalStoryShuffleStrategy] : []}
      onSelectionChange={onSelect}
    >
      {Object.entries(FinalStoryShuffle).map(([key, meta]) => (
        <SelectItem color="success" variant="flat" key={key}>
          {meta.name}
        </SelectItem>
      ))}
    </Select>
  );
};
