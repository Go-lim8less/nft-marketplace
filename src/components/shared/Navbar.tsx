"use client";

import { client } from "@/consts/client";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
  Icon,
  Text,
  Container,
  Avatar,
  IconButton,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { blo } from "blo";
import { FaRegMoon } from "react-icons/fa";
import { FiSearch, FiCompass, FiGrid } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import type { Wallet } from "thirdweb/wallets";
import { SideMenu } from "./SideMenu";

export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("rgba(248, 249, 250, 0.85)", "rgba(15, 17, 24, 0.85)");
  const boxShadow = useColorModeValue(
    "0 4px 20px rgba(0, 0, 0, 0.05)", 
    "0 4px 20px rgba(0, 0, 0, 0.3)"
  );
  const borderColor = useColorModeValue(
    "rgba(226, 232, 240, 0.6)", 
    "rgba(45, 55, 72, 0.6)"
  );
  const navLinkColor = useColorModeValue("text.light", "text.dark");
  const navLinkActiveColor = useColorModeValue("brand.600", "brand.300");
  
  return (
    <Box 
      py="16px" 
      px={{ base: "0", lg: "0" }} 
      position="sticky" 
      top="0" 
      zIndex="1000"
      bg={bgColor}
      boxShadow={boxShadow}
      backdropFilter="blur(16px)"
      borderBottom={`1px solid ${borderColor}`}
      className="glass-effect"
      sx={{
        "@supports (backdrop-filter: blur(16px))": {
          backdropFilter: "blur(16px)",
        },
        "@supports (-webkit-backdrop-filter: blur(16px))": {
          WebkitBackdropFilter: "blur(16px)",
        }
      }}
    >
      <Container maxW="100%" px={{ base: "16px", lg: "50px" }}>
        <Flex direction="row" justifyContent="space-between" alignItems="center">
          <HStack spacing={8}>
            <Heading
              as={Link}
              href="/"
              _hover={{ textDecoration: "none", transform: "scale(1.02)" }}
              className="gradient-text"
              bgGradient="linear(to-r, brand.500, brand.400)"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="extrabold"
              letterSpacing="-0.02em"
              transition="transform 0.2s ease"
            >
              Lim8less
            </Heading>
            
            {/* Desktop Navigation Links */}
            <HStack spacing={6} display={{ base: "none", md: "flex" }}>
              <NavLink icon={FiCompass} href="/" label="Explore" />
              <NavLink icon={FiGrid} href="/collections" label="Collections" />
            </HStack>
          </HStack>
          
          <HStack spacing={4}>
            {/* Theme Toggle and Account */}
            <Box display={{ lg: "flex", base: "none" }} alignItems="center" gap={4}>
              <ToggleThemeButton />
              {account && wallet ? (
                <ProfileButton address={account.address} wallet={wallet} />
              ) : (
                <ConnectButton
                  client={client}
                  theme={colorMode}
                  connectButton={{ 
                    style: { 
                      height: "48px",
                      background: colorMode === "dark" ? "rgba(92, 43, 230, 0.9)" : "rgba(92, 43, 230, 1)",
                      color: "white",
                      borderRadius: "12px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                      boxShadow: "0 4px 10px rgba(92, 43, 230, 0.3)",
                      padding: "0 24px",
                    } 
                  }}
                />
              )}
            </Box>
            
            {/* Mobile Menu */}
            <Box 
              display={{ lg: "none", base: "block" }} 
              ml={3}
              mr={0}
              position="relative"
              zIndex={2}
            >
              <SideMenu />
            </Box>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

function NavLink({ 
  icon, 
  href, 
  label,
  isActive = false
}: { 
  icon: React.ComponentType; 
  href: string; 
  label: string; 
  isActive?: boolean 
}) {
  const linkColor = useColorModeValue("text.light", "text.dark");
  const activeColor = useColorModeValue("brand.600", "brand.300");
  const hoverBg = useColorModeValue("rgba(92, 43, 230, 0.08)", "rgba(92, 43, 230, 0.15)");
  
  return (
    <Link 
      href={href} 
      _hover={{ textDecoration: "none" }}
    >
      <HStack 
        spacing={2}
        px={3}
        py={2}
        borderRadius="lg"
        color={isActive ? activeColor : linkColor}
        _hover={{ 
          bg: hoverBg,
          color: activeColor
        }}
        transition="all 0.2s ease"
      >
        <Icon as={icon} boxSize={4} />
        <Text fontWeight="500">{label}</Text>
      </HStack>
    </Link>
  );
}

function ProfileButton({
  address,
  wallet,
}: {
  address: string;
  wallet: Wallet;
}) {
  const { disconnect } = useDisconnect();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const { colorMode } = useColorMode();
  const menuBg = useColorModeValue("rgba(255, 255, 255, 0.95)", "rgba(26, 32, 44, 0.95)");
  const menuHoverBg = useColorModeValue("rgba(240, 240, 240, 0.9)", "rgba(45, 55, 72, 0.9)");
  const buttonBg = useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(26, 32, 44, 0.7)");
  const borderColor = useColorModeValue("rgba(226, 232, 240, 0.6)", "rgba(45, 55, 72, 0.6)");
  
  return (
    <Menu>
      <MenuButton 
        as={Button} 
        height="48px" 
        px={4}
        borderRadius="full"
        variant="outline"
        bg={buttonBg}
        backdropFilter="blur(8px)"
        borderColor={borderColor}
        _hover={{ 
          bg: useColorModeValue("rgba(240, 240, 240, 0.8)", "rgba(45, 55, 72, 0.8)"),
          borderColor: useColorModeValue("rgba(200, 214, 229, 0.8)", "rgba(74, 85, 104, 0.8)"),
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}
        transition="all 0.2s ease"
        sx={{
          "@supports (backdrop-filter: blur(8px))": {
            backdropFilter: "blur(8px)",
          }
        }}
      >
        <Flex direction="row" gap="3" alignItems="center">
          <Avatar 
            size="sm"
            src={ensAvatar ?? blo(address as `0x${string}`)}
            name={ensName || address.substring(0, 6)}
          />
          <Text display={{ base: "none", md: "block" }} fontSize="sm" fontWeight="medium">
            {ensName || `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
          </Text>
        </Flex>
      </MenuButton>
      <MenuList 
        bg={menuBg} 
        borderColor={borderColor}
        backdropFilter="blur(12px)"
        borderRadius="xl"
        overflow="hidden"
        py={2}
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
        sx={{
          "@supports (backdrop-filter: blur(12px))": {
            backdropFilter: "blur(12px)",
          }
        }}
      >
        <MenuItem 
          display="flex" 
          bg="transparent"
          _hover={{ bg: menuHoverBg }}
          py={3}
        >
          <Box mx="auto">
            <ConnectButton client={client} theme={colorMode} />
          </Box>
        </MenuItem>
        <MenuItem 
          as={Link} 
          href="/profile" 
          _hover={{ textDecoration: "none", bg: menuHoverBg }}
          bg="transparent"
          py={3}
          fontWeight="500"
        >
          Profile {ensName ? `(${ensName})` : ""}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (wallet) disconnect(wallet);
          }}
          bg="transparent"
          _hover={{ bg: menuHoverBg }}
          py={3}
          fontWeight="500"
          color="red.500"
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function ToggleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconColor = useColorModeValue("brand.600", "brand.300");
  const buttonBg = useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(26, 32, 44, 0.7)");
  
  return (
    <Tooltip label={colorMode === "light" ? "Dark mode" : "Light mode"} hasArrow placement="bottom">
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
        onClick={toggleColorMode}
        size="md"
        borderRadius="full"
        variant="ghost"
        color={iconColor}
        bg={buttonBg}
        backdropFilter="blur(8px)"
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
    </Tooltip>
  );
}
