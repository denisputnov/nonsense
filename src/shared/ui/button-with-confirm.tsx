import {Button, ButtonProps, TooltipProps} from '@heroui/react';
import {useState} from 'react';
import {Tooltip} from '@heroui/tooltip';

type Config = {
  button: Omit<ButtonProps, 'onPress' | 'onMouseLeave'>;
  tooltip: TooltipProps;
};

type ConditionalConfig = {
  default: Config;
  confirmationRequested: Config;
};

interface ButtonWithConfirmProps {
  onConfirm: () => void;
  config: ConditionalConfig;
}

export const ButtonWithConfirm = ({onConfirm, config}: ButtonWithConfirmProps) => {
  const [isConfirmationRequested, setIsConfirmationRequested] = useState<boolean>(false);

  const actualConfig = isConfirmationRequested ? config.confirmationRequested : config.default;

  const onPress = () => {
    if (!isConfirmationRequested) return setIsConfirmationRequested(true);

    onConfirm();

    setIsConfirmationRequested(false);
  };

  return (
    <Tooltip
      closeDelay={0}
      isOpen={isConfirmationRequested ? isConfirmationRequested : undefined}
      {...actualConfig.tooltip}
    >
      <Button onPress={onPress} onMouseLeave={() => setIsConfirmationRequested(false)} {...actualConfig.button} />
    </Tooltip>
  );
};
