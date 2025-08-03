import {Chip} from '@heroui/react';

export const NextQuestion = ({question}: {question: string}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Chip className="text-xl sm:text-3xl py-2 h-fit" color="primary" radius="lg">
        Следующий вопрос
      </Chip>
      <p className="text-white text-center text-3xl sm:text-5xl font-semibold">{question}</p>
    </div>
  );
};
