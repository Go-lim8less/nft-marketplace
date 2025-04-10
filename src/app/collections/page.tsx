"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Card,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
  Container,
  SimpleGrid,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Select,
  CardBody,
  Icon,
  Button,
  Avatar,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { FaEthereum, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "chain">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const cardBg = useColorModeValue("card.light", "card.dark");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const shadowColor = useColorModeValue(
    "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
    "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
  );
  const secondaryBg = useColorModeValue("gray.50", "gray.900");

  const filteredAndSortedCollections = useMemo(() => {
    // Filter by search query
    let collections = [...NFT_CONTRACTS];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      collections = collections.filter(collection => 
        collection.title?.toLowerCase().includes(query) ||
        collection.chain.name.toLowerCase().includes(query) ||
        collection.type.toLowerCase().includes(query)
      );
    }
    
    // Sort by selected field
    collections.sort((a, b) => {
      if (sortBy === "name") {
        const nameA = a.title?.toLowerCase() || "";
        const nameB = b.title?.toLowerCase() || "";
        return sortDirection === "asc" 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        const chainA = a.chain.name.toLowerCase();
        const chainB = b.chain.name.toLowerCase();
        return sortDirection === "asc"
          ? chainA.localeCompare(chainB)
          : chainB.localeCompare(chainA);
      }
    });
    
    return collections;
  }, [searchQuery, sortBy, sortDirection]);

  return (
    <Container maxW="1400px" py={{ base: 8, md: 12 }}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading 
            size="2xl"
            bgGradient="linear(to-r, brand.400, brand.600)"
            bgClip="text"
            fontWeight="extrabold"
            mb={4}
          >
            All Collections
          </Heading>
          <Text fontSize="xl" color={textColor} maxW="700px" mx="auto">
            Explore and discover all available NFT collections
          </Text>
        </Box>

        {/* Search and filter section */}
        <Box 
          p={5} 
          borderRadius="xl" 
          bg={secondaryBg}
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex 
            direction={{ base: "column", md: "row" }} 
            gap={4}
            align={{ base: "stretch", md: "center" }}
            justify="space-between"
          >
            <InputGroup maxW={{ base: "100%", md: "400px" }}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search collections..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="lg"
              />
            </InputGroup>
            
            <HStack spacing={4}>
              <Select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "chain")}
                borderRadius="lg"
                w={{ base: "full", md: "160px" }}
                leftIcon={<FiFilter />}
              >
                <option value="name">Sort by Name</option>
                <option value="chain">Sort by Chain</option>
              </Select>
              
              <Button
                leftIcon={sortDirection === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
                onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                variant="outline"
                borderRadius="lg"
              >
                {sortDirection === "asc" ? "Ascending" : "Descending"}
              </Button>
            </HStack>
          </Flex>
        </Box>

        {/* Display results count */}
        <Text fontWeight="medium" color={textColor}>
          Showing {filteredAndSortedCollections.length} collection{filteredAndSortedCollections.length !== 1 ? 's' : ''}
        </Text>

        {/* Collections grid */}
        {filteredAndSortedCollections.length > 0 ? (
          <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
            spacing={{ base: 4, lg: 6 }}
          >
            {filteredAndSortedCollections.map((item) => (
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
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-8px)",
                    boxShadow: shadowColor,
                  }}
                  h="100%"
                >
                  <Box position="relative">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      objectFit="cover"
                      h="200px"
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
                    <Flex justify="space-between" align="center" mb={2}>
                      <Heading
                        size="md"
                        fontWeight="semibold"
                        color={useColorModeValue("gray.800", "white")}
                        noOfLines={1}
                      >
                        {item.title}
                      </Heading>
                      <Badge 
                        colorScheme={item.type === "ERC721" ? "purple" : "blue"}
                        borderRadius="full"
                        px={2}
                      >
                        {item.type}
                      </Badge>
                    </Flex>
                    <Text fontSize="sm" color={textColor} noOfLines={2} mb={3}>
                      {item.description || "Explore this amazing collection of unique digital assets"}
                    </Text>
                    <HStack spacing={2}>
                      {item.chain.name.toLowerCase().includes("eth") && (
                        <Icon as={FaEthereum} color="gray.500" />
                      )}
                      <Text fontSize="xs" color="gray.500">
                        {item.chain.name} • {item.type}
                      </Text>
                    </HStack>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </SimpleGrid>
        ) : (
          <Box 
            textAlign="center" 
            p={10} 
            borderRadius="xl" 
            bg={secondaryBg}
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={3}>No collections found</Heading>
            <Text>Try adjusting your search criteria</Text>
          </Box>
        )}

        {/* Full list of blockchain networks */}
        <Box mt={10}>
          <Heading 
            size="lg" 
            mb={6}
            fontWeight="bold"
            color={useColorModeValue("gray.800", "white")}
          >
            Supported Blockchains
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={5}>
            {Array.from(new Set(NFT_CONTRACTS.map(c => c.chain.name))).map(chainName => (
              <HStack 
                key={chainName} 
                p={4} 
                borderRadius="lg" 
                bg={cardBg} 
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="sm"
              >
                <Avatar 
                  size="sm" 
                  name={chainName} 
                  bg={chainName.toLowerCase().includes("eth") ? "blue.500" : "purple.500"}
                />
                <Text fontWeight="medium">{chainName}</Text>
              </HStack>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
} 