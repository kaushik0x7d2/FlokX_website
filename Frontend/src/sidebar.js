import React, { useState } from 'react';
import { Flex, Text, IconButton, Divider } from '@chakra-ui/react';
import { FiMenu, FiHome, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import { IoPawOutline } from 'react-icons/io5';
import { Link, NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [navSize, setNavSize] = useState("large");

  const toggleNavSize = () => {
    setNavSize(prevSize => (prevSize === "small" ? "large" : "small"));
  };


  return (
    <Flex
      pos="sticky"
      left="5"
      h="95vh"
      marginTop="2.5vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize === "small" ? "15px" : "30px"}
      w={navSize === "small" ? "75px" : "200px"}
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize === "small" ? "center" : "flex-start"}
        as="nav"
      >
<div style={{ display: 'contents', borderRadius: 'inherit', pointerEvents: 'none' }}>
          <img
            src="https://framerusercontent.com/images/FEqE2MSr0eqAfcBABVgaRkLHE.png"
            alt=""
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              display: 'block',
              width: '40px',
              height: '40px',
              borderRadius: 'inherit',
              objectPosition: 'center',
              objectFit: 'cover',
              imageRendering: 'auto',
            }}
          />
        </div>
        <IconButton
          background="none"
          mt={5}
          _hover={{ background: 'none' }}
          icon={<FiMenu />}
          onClick={toggleNavSize}
        />

        <Flex flexDir="column" mt={4} alignItems={navSize === "small" ? "center" : "flex-start"}>
          <NavLink exact to="/" activeClassName="active">
            <Flex align="center" style = {{padding : "20px"}}>
              <FiHome />
              {navSize === "large" && <Text ml={3}>Dashboard</Text>}
            </Flex>
          </NavLink>

          <NavLink to="/selleraccounts" activeClassName="active">
            <Flex align="center" style = {{padding : "20px"}}>
              <FiDollarSign />
              {navSize === "large" && <Text ml={3}>Seller Accounts</Text>}
            </Flex>
          </NavLink>

          <NavLink to="/goatdatacomponent" activeClassName="active">
            <Flex align="center" style = {{padding : "20px"}}>
              <IoPawOutline />
              {navSize === "large" && <Text ml={3}>Goat Data</Text>}
            </Flex>
          </NavLink>

          <NavLink to="/buyersales" activeClassName="active">
            <Flex align="center" style = {{padding : "20px"}}>
              <FiBriefcase />
              {navSize === "large" && <Text ml={3}>Buyer Sales</Text>}
            </Flex>
          </NavLink>
        </Flex>
      </Flex>

      <Flex p="5%" flexDir="column" w="100%" mb={4} alignItems="flex-start">
        <Divider display={navSize === "small" ? "none" : "flex"} />
        <Flex mt={4} align="center">
          {/* Additional content for the bottom section of the sidebar */}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
