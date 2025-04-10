import { MediaRenderer, useReadContract } from "thirdweb/react";
import { getNFT as getNFT721 } from "thirdweb/extensions/erc721";
import { getNFT as getNFT1155 } from "thirdweb/extensions/erc1155";
import { client } from "@/consts/client";
import { 
  Box, 
  Flex, 
  Heading, 
  Tab, 
  TabList, 
  Tabs, 
  Text, 
  Container,
  useColorModeValue,
  TabIndicator,
  Badge,
  Skeleton,
  VStack,
  HStack,
  Icon,
  Avatar
} from "@chakra-ui/react";
import { useState } from "react";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { ListingGrid } from "./ListingGrid";
import { AllNftsGrid } from "./AllNftsGrid";
import { FaEthereum } from "react-icons/fa";

export function Collection() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const {
    type,
    nftContract,
    isLoading,
    contractMetadata,
    listingsInSelectedCollection,
    supplyInfo,
  } = useMarketplaceContext();

  const { data: firstNFT, isLoading: isLoadingFirstNFT } = useReadContract(
    type === "ERC1155" ? getNFT1155 : getNFT721,
    {
      contract: nftContract,
      tokenId: 0n,
      queryOptions: {
        enabled: isLoading || !!contractMetadata?.image,
      },
    }
  );

  const thumbnailImage =
    contractMetadata?.image || firstNFT?.metadata.image || "";
    
  const cardBg = useColorModeValue("white", "card.dark");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const brandGradient = "linear(to-r, brand.400, brand.600)";

  return (
    <Container maxW="1400px" py={{ base: 8, md: 12 }}>
      <VStack spacing={8} align="stretch">
        <Box 
          bg={cardBg} 
          borderRadius="xl" 
          p={8} 
          boxShadow="sm"
          border="1px solid"
          borderColor={borderColor}
        >
          <Flex 
            direction={{ base: "column", md: "row" }} 
            gap={8}
            align="center"
          >
            <Skeleton isLoaded={!isLoadingFirstNFT} borderRadius="xl" overflow="hidden">
              <MediaRenderer
                client={client}
                src={thumbnailImage}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Skeleton>
            
            <VStack align={{ base: "center", md: "start" }} spacing={4} flex={1}>
              <HStack>
                <Badge colorScheme="brand" py={1} px={3} borderRadius="full">
                  {type || "Collection"}
                </Badge>
                {type === "ERC721" && (
                  <Badge colorScheme="gray" py={1} px={3} borderRadius="full">
                    <HStack spacing={1}>
                      <Icon as={FaEthereum} />
                      <Text>Ethereum</Text>
                    </HStack>
                  </Badge>
                )}
              </HStack>
              
              <Heading 
                size="xl" 
                fontWeight="bold"
                bgGradient={brandGradient}
                bgClip="text"
              >
                {contractMetadata?.name || "Unknown collection"}
              </Heading>
              
              {contractMetadata?.description && (
                <Text
                  color={textColor}
                  maxW="700px"
                >
                  {contractMetadata.description}
                </Text>
              )}
              
              {supplyInfo && (
                <HStack spacing={4}>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color={textColor}>Total items</Text>
                    <Text fontWeight="bold">
                      {(supplyInfo.endTokenId - supplyInfo.startTokenId + 0n).toString()}
                    </Text>
                  </VStack>
                </HStack>
              )}
            </VStack>
          </Flex>
        </Box>

        <Box>
          <Tabs
            variant="unstyled"
            mx="auto"
            onChange={(index) => setTabIndex(index)}
            isLazy
            colorScheme="brand"
          >
            <TabList gap={4}>
              <Tab 
                fontWeight="medium" 
                _selected={{ color: "brand.500", fontWeight: "semibold" }}
              >
                Listings ({listingsInSelectedCollection.length || 0})
              </Tab>
              <Tab
                fontWeight="medium"
                _selected={{ color: "brand.500", fontWeight: "semibold" }}
              >
                All items
                {supplyInfo
                  ? ` (${(
                      supplyInfo.endTokenId -
                      supplyInfo.startTokenId +
                      0n
                    ).toString()})`
                  : ""}
              </Tab>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="brand.500"
              borderRadius="1px"
            />
          </Tabs>
        </Box>
        
        <Box>
          {tabIndex === 0 && <ListingGrid />}
          {tabIndex === 1 && <AllNftsGrid />}
        </Box>
      </VStack>
    </Container>
  );
}
