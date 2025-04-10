"use client";

import { client } from "@/consts/client";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useColorMode,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Avatar,
  Divider,
  useColorModeValue,
  IconButton,
  Flex,
  Badge,
  Image,
  Icon,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaRegMoon, FaUser, FaCompass, FaStore, FaClipboardList } from "react-icons/fa";
import { FiGrid, FiCompass, FiSearch } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { blo } from "blo";

export function SideMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { disconnect } = useDisconnect();
  const account = useActiveAccount();
  const { data: ensName } = useGetENSName({ address: account?.address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const { colorMode, toggleColorMode } = useColorMode();
  const wallet = useActiveWallet();
  
  const bgColor = useColorModeValue("rgba(248, 249, 250, 0.95)", "rgba(15, 17, 24, 0.95)");
  const borderColor = useColorModeValue("rgba(226, 232, 240, 0.6)", "rgba(45, 55, 72, 0.6)");
  const iconColor = useColorModeValue("brand.600", "brand.300");
  const hoverBg = useColorModeValue("rgba(240, 240, 240, 0.8)", "rgba(45, 55, 72, 0.8)");
  const buttonBg = useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(26, 32, 44, 0.7)");
  const textColor = useColorModeValue("text.light", "text.dark");
  const secondaryTextColor = useColorModeValue("text.secondary.light", "text.secondary.dark");

  return (
    <>
      <IconButton
        aria-label="Open menu"
        display={{ lg: "none", base: "flex" }}
        ref={btnRef}
        onClick={onOpen}
        icon={<HamburgerIcon boxSize={5} />}
        variant="ghost"
        color={iconColor}
        fontSize="xl"
        bg={buttonBg}
        backdropFilter="blur(8px)"
        borderRadius="full"
        size="md"
        width="40px"
        height="40px"
        _hover={{
          bg: useColorModeValue("rgba(240, 240, 240, 0.8)", "rgba(45, 55, 72, 0.8)"),
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}
        transition="all 0.2s ease"
        sx={{
          "@supports (backdrop-filter: blur(8px))": {
            backdropFilter: "blur(8px)",
          }
        }}
      />
      <Drawer 
        isOpen={isOpen} 
        placement="right" 
        onClose={onClose} 
        size={{ base: "full", sm: "sm" }}
      >
        <DrawerOverlay backdropFilter="blur(8px)" bg="rgba(0, 0, 0, 0.4)" />
        <DrawerContent 
          bg={bgColor} 
          borderLeft={`1px solid ${borderColor}`}
          backdropFilter="blur(20px)"
          className="glass-effect"
          boxShadow="-10px 0 30px rgba(0, 0, 0, 0.15)"
          w="100%"
          maxW="100%"
          sx={{
            "@supports (backdrop-filter: blur(20px))": {
              backdropFilter: "blur(20px)",
            }
          }}
        >
          <DrawerCloseButton 
            color={iconColor} 
            size="lg" 
            top={4} 
            right={4} 
            zIndex={2}
          />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor} pt={8} pb={6} px={6}>
            <Box>
              <Text 
                fontWeight="bold" 
                className="gradient-text"
                fontSize="xl"
                letterSpacing="-0.02em"
                mb={3}
              >
                Lim8less
              </Text>
              <HStack spacing={4} mt={2}>
                <IconButton
                  aria-label="Toggle color mode"
                  icon={colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
                  onClick={toggleColorMode}
                  size="md"
                  variant="ghost"
                  color={iconColor}
                  bg={buttonBg}
                  backdropFilter="blur(8px)"
                  borderRadius="full"
                  _hover={{
                    bg: useColorModeValue("rgba(240, 240, 240, 0.8)", "rgba(45, 55, 72, 0.8)"),
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                  }}
                  transition="all 0.2s ease"
                />
                <Text fontSize="sm" color={secondaryTextColor}>
                  {colorMode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                </Text>
              </HStack>
            </Box>
          </DrawerHeader>
          
          <DrawerBody 
            py={6} 
            px={6} 
            overflowY="auto" 
            css={{
              '&::-webkit-scrollbar': { 
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
                backgroundColor: 'transparent'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)'),
                borderRadius: '24px',
              },
            }}
          >
            <VStack spacing={8} align="stretch">
              {account ? (
                <Box 
                  p={5} 
                  borderRadius="xl" 
                  bg={useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(26, 32, 44, 0.7)")}
                  backdropFilter="blur(12px)"
                  boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <VStack spacing={4} align="start">
                    <HStack width="100%" spacing={3}>
                      <Avatar 
                        size="lg" 
                        src={ensAvatar ?? blo(account.address as `0x${string}`)}
                        name={ensName || account.address.substring(0, 6)}
                        borderRadius="xl"
                        borderWidth="2px"
                        borderColor="brand.400"
                        bg="transparent"
                      />
                      <VStack spacing={1} align="start">
                        <Text fontWeight="bold" fontSize="md">
                          {ensName || `${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4)}`}
                        </Text>
                        <Badge 
                          colorScheme="brand" 
                          fontSize="xs" 
                          px={2} 
                          py={1} 
                          borderRadius="full"
                        >
                          Connected
                        </Badge>
                      </VStack>
                    </HStack>
                    
                    <Button
                      as={Link}
                      href="/profile"
                      variant="outline"
                      size="sm"
                      width="100%"
                      borderRadius="lg"
                      borderColor={borderColor}
                      _hover={{
                        bg: hoverBg,
                        textDecoration: "none",
                        transform: "translateY(-2px)",
                        boxShadow: "sm"
                      }}
                      onClick={onClose}
                      leftIcon={<FaUser />}
                      transition="all 0.2s ease"
                    >
                      View Profile
                    </Button>
                  </VStack>
                </Box>
              ) : (
                <Box>
                  <ConnectButton 
                    theme={colorMode} 
                    client={client} 
                    connectButton={{
                      style: { 
                        width: "100%",
                        background: colorMode === "dark" ? "rgba(92, 43, 230, 0.9)" : "rgba(92, 43, 230, 1)",
                        color: "white",
                        borderRadius: "12px",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                        boxShadow: "0 4px 10px rgba(92, 43, 230, 0.3)",
                        padding: "12px 24px",
                      }
                    }}
                  />
                </Box>
              )}
              
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  color={secondaryTextColor}
                  mb={3}
                >
                  Navigation
                </Text>
                <Divider borderColor={borderColor} mb={3} />
                
                <VStack spacing={2} align="stretch">
                  <NavItem 
                    icon={FiCompass} 
                    label="Explore" 
                    href="/" 
                    onClick={onClose} 
                  />
                  <NavItem 
                    icon={FiGrid} 
                    label="Collections" 
                    href="/collections" 
                    onClick={onClose} 
                  />
                  {account && (
                    <NavItem 
                      icon={FaClipboardList} 
                      label="My NFTs" 
                      href="/profile" 
                      onClick={onClose} 
                    />
                  )}
                </VStack>
              </Box>
              
              <Box pt={6}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  color={secondaryTextColor}
                  mb={3}
                >
                  Featured
                </Text>
                <Divider borderColor={borderColor} mb={4} />
                
                <VStack spacing={4} align="stretch">
                  <Box
                    borderRadius="xl"
                    overflow="hidden"
                    bg={useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(26, 32, 44, 0.7)")}
                    backdropFilter="blur(12px)"
                    boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                    border="1px solid"
                    borderColor={borderColor}
                    as={Link}
                    href="/collection/1/0x8Db59F1A6783CD2F5ED7b9FEbB35f53d3d36714a"
                    _hover={{ 
                      textDecoration: "none",
                      transform: "translateY(-4px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.3s ease"
                    onClick={onClose}
                    maxW="100%"
                  >
                    <Flex direction="column">
                      <Box position="relative" height="120px" width="100%">
                        <Image
                          src="https://ipfs.io/ipfs/QmbXPm2Rx6ahG7JMHDhp2guqcXCfkA1AvUP96MKcc1KQ1m/ChatGPT%20Image%20Apr%2010%2C%202025%2C%2002_24_29%20AM-1.jpeg"
                          alt="Arcade Anomalies Collection"
                          objectFit="cover"
                          width="100%"
                          height="100%"
                        />
                        <Badge
                          position="absolute"
                          top={3}
                          right={3}
                          colorScheme="brand"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontSize="xs"
                          boxShadow="0 2px 5px rgba(0,0,0,0.2)"
                        >
                          Popular
                        </Badge>
                      </Box>
                      <Box p={4}>
                        <Text fontWeight="bold" fontSize="sm" mb={1}>
                          Arcade Anomalies
                        </Text>
                        <Text fontSize="xs" color={secondaryTextColor}>
                          Glitch Hunters Edition
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                  
                  <Box
                    borderRadius="xl"
                    overflow="hidden"
                    bg={useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(26, 32, 44, 0.7)")}
                    backdropFilter="blur(12px)"
                    boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                    border="1px solid"
                    borderColor={borderColor}
                    as={Link}
                    href="/collection/1/0xfD4E00D4FFEad1cf4Cde66efc7EAc1572E700376"
                    _hover={{ 
                      textDecoration: "none",
                      transform: "translateY(-4px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.3s ease"
                    onClick={onClose}
                    maxW="100%"
                  >
                    <Flex direction="column">
                      <Box position="relative" height="120px" width="100%">
                        <Image
                          src="https://c0e15a3ae2a33960ae1893f1a6533e1b.ipfscdn.io/ipfs/QmRaoVEuioWsU9pZd6ZvgKfSJuYLdJu2L5HMYR7Gipw1P3/Gemini_Generated_Image_zdn6idzdn6idzdn6.jpeg"
                          alt="AI SpeedZone Collection"
                          objectFit="cover"
                          width="100%"
                          height="100%"
                        />
                        <Badge
                          position="absolute"
                          top={3}
                          right={3}
                          colorScheme="green"
                          borderRadius="full"
                          px={2}
                          py={1}
                          fontSize="xs"
                          boxShadow="0 2px 5px rgba(0,0,0,0.2)"
                        >
                          New
                        </Badge>
                      </Box>
                      <Box p={4}>
                        <Text fontWeight="bold" fontSize="sm" mb={1}>
                          AI SpeedZone
                        </Text>
                        <Text fontSize="xs" color={secondaryTextColor}>
                          Digital Art Collection
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </DrawerBody>
          
          {account && wallet && (
            <DrawerFooter borderTopWidth="1px" borderColor={borderColor} py={4}>
              <Button
                leftIcon={<RiLogoutBoxLine />}
                onClick={() => {
                  if (wallet) disconnect(wallet);
                  onClose();
                }}
                variant="outline"
                colorScheme="red"
                width="100%"
                bg="transparent"
                backdropFilter="blur(8px)"
                borderColor="red.400"
                borderRadius="lg"
                py={6}
                _hover={{
                  bg: "rgba(254, 178, 178, 0.1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(254, 178, 178, 0.2)"
                }}
                transition="all 0.2s ease"
              >
                Disconnect Wallet
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

function NavItem({ 
  icon, 
  label, 
  href, 
  onClick 
}: { 
  icon: React.ComponentType; 
  label: string; 
  href: string; 
  onClick: () => void; 
}) {
  const hoverBg = useColorModeValue("rgba(92, 43, 230, 0.08)", "rgba(92, 43, 230, 0.15)");
  const activeColor = useColorModeValue("brand.600", "brand.300");
  const textColor = useColorModeValue("text.light", "text.dark");
  
  return (
    <Button 
      as={Link} 
      href={href} 
      variant="ghost" 
      justifyContent="flex-start"
      leftIcon={<Icon as={icon} boxSize={5} />}
      _hover={{ 
        bg: hoverBg, 
        color: activeColor,
        textDecoration: "none", 
        transform: "translateY(-2px)" 
      }}
      onClick={onClick}
      bg="transparent"
      color={textColor}
      borderRadius="lg"
      fontWeight="500"
      py={6}
      px={4}
      transition="all 0.2s ease"
      width="100%"
      height="auto"
    >
      {label}
    </Button>
  );
}
