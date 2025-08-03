'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import {copyToClipboard} from '@/shared/utils';
import {CheckIcon, CopyIcon, LinkIcon, QrCodeIcon, UserRoundPlusIcon, XIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {usePulsarState} from '../lib/pulsar';

const DEFAULT_BUTTON_TEXT = 'Пригласить участников';

export const InvitePlayersMenu = () => {
  const [copyStatus, setCopyStatus] = useState<'success' | 'error' | null>(null);
  const [buttonText, setButtonText] = useState<string>(DEFAULT_BUTTON_TEXT);
  const qrModalDisclosure = useDisclosure();
  const {code} = usePulsarState();

  const copyLink = () => {
    const handler = async () => {
      const isSuccess = await copyToClipboard(window?.location?.href);

      setCopyStatus(isSuccess ? 'success' : 'error');
      setButtonText(isSuccess ? 'Ссылка скопирована' : 'Не удалось скопировать');
    };

    handler();
  };

  const copyCode = () => {
    const handler = async () => {
      if (!code) {
        setCopyStatus('error');
        setButtonText('Не удалось скопировать');
        return;
      }

      const isSuccess = await copyToClipboard(code);

      setCopyStatus(isSuccess ? 'success' : 'error');
      setButtonText(isSuccess ? 'Код скопирован' : 'Не удалось скопировать');
    };

    handler();
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (copyStatus !== null) {
      timeout = setTimeout(() => {
        setCopyStatus(null);
        setButtonText(DEFAULT_BUTTON_TEXT);
      }, 2000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [copyStatus]);

  const getIcon = () => {
    if (copyStatus === 'success') return <CheckIcon size={16} />;
    if (copyStatus === 'error') return <XIcon size={16} />;

    return <UserRoundPlusIcon size={16} />;
  };

  const getColor = () => {
    if (copyStatus === 'success') return 'success';
    if (copyStatus === 'error') return 'danger';

    return 'default';
  };

  return (
    <>
      <QrModal controls={qrModalDisclosure} encoded={window?.location?.href} />
      <Dropdown>
        <DropdownTrigger>
          <Button color={getColor()} startContent={getIcon()} variant="flat">
            {buttonText}
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="copy-link" onPress={copyLink} startContent={<LinkIcon size={12} />}>
            Скопировать прямую ссылку
          </DropdownItem>
          <DropdownItem key="copy-code" onPress={copyCode} startContent={<CopyIcon size={12} />}>
            Скопировать код комнаты
          </DropdownItem>
          <DropdownItem key="qr" onPress={qrModalDisclosure.onOpen} startContent={<QrCodeIcon size={12} />}>
            Показать QR-код
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

type QrModalProps = {
  controls: ReturnType<typeof useDisclosure>;
  encoded: string;
};

const QrModal = ({controls: {isOpen, onOpenChange}, encoded}: QrModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">Ссылка на комнату</ModalHeader>
            <ModalBody>
              <QRCode
                size={512}
                style={{height: 'auto', maxWidth: '100%', width: '100%'}}
                value={encoded}
                bgColor="#18181b"
                fgColor="#9d9d9d"
                viewBox="0 0 512 512"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="flat" onPress={onClose} className="w-full">
                Закрыть
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
