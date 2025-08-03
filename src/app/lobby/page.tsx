'use client';

import {SESSION_CODE_SCHEMA, usePulsarClient} from '@/shared/lib/pulsar';
import {Alert, Button} from '@heroui/react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import z from 'zod';
import {Input} from '@/shared/ui';

export default function Page() {
  const {username, isUsernameValid, setUsername, usernameErrorMessage} = usePulsarClient();

  const router = useRouter();

  const [identifier, setIdentifier] = useState<string>();

  const {success: isUuidIdentifier} = z.uuidv4().safeParse(identifier);
  const {success: isCodeIdentifier} = SESSION_CODE_SCHEMA.safeParse(identifier);

  const isIdentifierValid = isUuidIdentifier || isCodeIdentifier;

  const searchParams = useSearchParams();

  const identifierFromParams = searchParams.get('i');

  useEffect(() => {
    if (!identifierFromParams) return;
    setIdentifier(identifierFromParams);
  }, [identifierFromParams]);

  const onConnect = () => {
    router.replace(`/room/${identifier}`);
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center max-w-md w-full mx-auto min-h-screen-no-header">
      <h1 className="text-center font-semibold w-full">Выберите имя пользователя</h1>
      <Input
        label="Имя пользователя"
        value={username}
        onValueChange={setUsername}
        errorMessage={usernameErrorMessage}
        isInvalid={!isUsernameValid}
        onBlur={() => setUsername(username.trim())}
      />
      {!isIdentifierValid && (
        <div>
          <Alert
            color="danger"
            variant="flat"
            title="Некорректный код комнаты"
            description="Ссылка, по которой вы пытетесь подключиться, введена неверно. Пожалуйста, повторно запросите ссылку для подключения у создателя игровой комнаты."
            icon="danger"
          />
        </div>
      )}
      <Button color="primary" fullWidth isDisabled={!isUsernameValid || !isIdentifierValid} onPress={onConnect}>
        Подключиться
      </Button>
    </div>
  );
}
