import React from 'react';
import { Box, Flex, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import LoadList from './loadlist';
import MergeLoadsPopup from './mergeloadspopup';
import LoadPopup from './loadpopup';
import SplitLoadPopup from './splitloadpopup';

const Home = () => {
  const { isOpen: showAddLoadPopup, onOpen: handleAddNewLoad, onClose: handleCloseAddLoadPopup } = useDisclosure();
  const { isOpen: showMergePopup, onOpen: handleMergeLoads, onClose: handleCloseMergePopup } = useDisclosure();
  const { isOpen: showSplitLoadPopup, onOpen: handleSplitLoad, onClose: handleCloseSplitLoadPopup } = useDisclosure();

  return (
    <Flex style = {{marginLeft: "5px"}}>
      <Box p={4}>
        <Button onClick={handleAddNewLoad} colorScheme="green" mb={4}>
          Add New Load
        </Button>
        <Button onClick={handleMergeLoads} colorScheme="green" mb={4} ml={4}>
          Merge Loads
        </Button>
        <Button onClick={handleSplitLoad} colorScheme="green" mb={4} ml={4}>
          Split Load
        </Button>
        <LoadList />
      </Box>
      <Modal isOpen={showAddLoadPopup} onClose={handleCloseAddLoadPopup} size="sm">
        <ModalOverlay />
        <ModalContent className="modal-content modal-large-height">
          <ModalHeader>Add New Load</ModalHeader>
          <ModalCloseButton size="sm" />
          <ModalBody>
            <LoadPopup refreshLoadList={handleCloseAddLoadPopup} onClose={handleCloseAddLoadPopup} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={showMergePopup} onClose={handleCloseMergePopup} size="xl">
        <ModalOverlay />
        <ModalContent className="modal-content modal-large-height">
          <ModalHeader>Merge Loads</ModalHeader>
          <ModalCloseButton size="sm" />
          <ModalBody>
            <MergeLoadsPopup refreshLoadList={handleCloseMergePopup} onClose={handleCloseMergePopup} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={showSplitLoadPopup} onClose={handleCloseSplitLoadPopup} size="xl">
        <ModalOverlay />
        <ModalContent className="modal-content modal-large-height">
          <ModalHeader>Split Load</ModalHeader>
          <ModalCloseButton size="sm" />
          <ModalBody>
            <SplitLoadPopup refreshLoadList={handleCloseSplitLoadPopup} onClose={handleCloseSplitLoadPopup} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Home;
