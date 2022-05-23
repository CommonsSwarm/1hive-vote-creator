import Editor from '@monaco-editor/react';
import { useChain, useSpringRef } from '@react-spring/web';
import { Box, Button, VStack, useDisclosure } from '@chakra-ui/react';

import SelectWalletModal from '../components/modal';
import FadeIn from '../components/animations/fade-in';
import { BtnSuccess, BtnWarning } from '../components/buttons';

import { theme } from '../editor/theme';
import { conf, contribution, language } from '../editor/evmcl';

import { useTerminal } from '../utils/useTerminal';

const Terminal = () => {
  const {
    error,
    loading,
    url,
    code,
    setCode,
    address,
    addressShortened,
    onForward,
    onDisconnect,
  } = useTerminal();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const terminalRef = useSpringRef();
  const buttonsRef = useSpringRef();
  const footerRef = useSpringRef();

  useChain([terminalRef, buttonsRef, footerRef]);

  return (
    <>
      <Box maxWidth="956px" margin="0 auto" my={16}>
        <FadeIn componentRef={terminalRef}>
          <Editor
            height="50vh"
            theme="theme"
            language="evmcl"
            value={code as string}
            onChange={(str) => setCode(str || '')}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme('theme', theme);
              monaco.languages.register(contribution);
              monaco.languages.setLanguageConfiguration('evmcl', conf);
              monaco.languages.setMonarchTokensProvider('evmcl', language);
            }}
            onMount={(editor) => {
              editor.setPosition({ lineNumber: 10000, column: 0 });
              editor.focus();
            }}
            options={{
              fontSize: 22,
              fontFamily: 'Ubuntu Mono',
              detectIndentation: false,
              tabSize: 2,
              language: 'evmcl',
              minimap: {
                enabled: false,
              },
              scrollbar: {
                useShadows: false,
                verticalScrollbarSize: 7,
                vertical: 'hidden',
              },
            }}
          />
        </FadeIn>
        <FadeIn componentRef={buttonsRef}>
          <VStack mt={3} alignItems="flex-end" gap={3}>
            {!address ? (
              <BtnSuccess onClick={onOpen}>Connect</BtnSuccess>
            ) : (
              <>
                {url ? (
                  <BtnWarning onClick={() => window.open(url, '_blank')}>
                    Go to vote
                  </BtnWarning>
                ) : null}

                <BtnSuccess onClick={onForward}>
                  {`${
                    loading ? 'Forwarding' : 'Forward'
                  } from ${addressShortened}`}
                </BtnSuccess>
                <Button
                  variant="link"
                  color="white"
                  fontSize="16px"
                  onClick={onDisconnect}
                >
                  Disconnect
                </Button>
              </>
            )}

            {error ? (
              <BtnWarning>{error ? 'Error: ' + error : null}</BtnWarning>
            ) : null}
          </VStack>
        </FadeIn>
      </Box>
      <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
};

export default Terminal;
