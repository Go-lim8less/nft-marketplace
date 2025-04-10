"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
  Container,
  SimpleGrid,
  Button,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  const cardBg = useColorModeValue("card.light", "card.dark");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const shadowColor = useColorModeValue(
    "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
    "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
  );

  return (
    <Container maxW="1400px" py={{ base: 8, md: 12 }}>
      <Flex direction="column" gap={8}>
        <Box textAlign="center" mb={8}>
          <Heading 
            size="2xl"
            bgGradient="linear(to-r, brand.400, brand.600)"
            bgClip="text"
            fontWeight="extrabold"
            mb={4}
          >
            Discover, Collect, and Sell NFTs
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="700px" mx="auto">
            Explore the best digital assets from top creators and collections
          </Text>
        </Box>

        <Box>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading 
              size="lg"
              fontWeight="bold"
              color={useColorModeValue("gray.800", "white")}
            >
              Trending Collections
            </Heading>
            <Button 
              as={Link}
              href="/collections"
              variant="ghost" 
              rightIcon={<Icon as={FaArrowRight} />}
              color="brand.500"
              _hover={{ 
                transform: "translateX(4px)",
                color: "brand.600",
                textDecoration: "none"
              }}
              transition="all 0.2s"
            >
              View all
            </Button>
          </Flex>
          
          <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
            spacing={{ base: 4, lg: 6 }}
          >
            {NFT_CONTRACTS.map((item) => (
              <Link
                _hover={{ textDecoration: "none" }}
                key={item.address}
                href={`/collection/${item.chain.id.toString()}/${item.address}`}
              >
                <Card
                  bg={cardBg}
                  borderRadius="xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor={borderColor}
                  transition="all 0.2s"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: shadowColor,
                  }}
                  h="100%"
                >
                  <Box position="relative">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      objectFit="cover"
                      h="240px"
                      w="100%"
                    />
                    <Badge 
                      position="absolute" 
                      top={3} 
                      right={3}
                      colorScheme="brand" 
                      borderRadius="full" 
                      px={3}
                      py={1}
                    >
                      {item.chain.name}
                    </Badge>
                  </Box>
                  <CardBody p={4}>
                    <Heading
                      size="md"
                      fontWeight="semibold"
                      color={useColorModeValue("gray.800", "white")}
                      noOfLines={1}
                      mb={2}
                    >
                      {item.title}
                    </Heading>
                    <Text fontSize="sm" color={textColor} noOfLines={2}>
                      {item.description || "Explore this amazing collection of unique digital assets"}
                    </Text>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Container>
  );
}

