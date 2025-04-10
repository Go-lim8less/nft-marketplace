import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  SimpleGrid,
  useBreakpointValue,
  Text,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { toEther } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

export function ListingGrid() {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();
  const len = listingsInSelectedCollection.length;
  const columns = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  });
  
  const cardBg = useColorModeValue("white", "card.dark");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  
  if (!listingsInSelectedCollection || !len) return <></>;
  
  return (
    <SimpleGrid columns={columns} spacing={4} p={3} mx="auto" mt="16px">
      {listingsInSelectedCollection.map((item) => (
        <Box
          key={item.id.toString()}
          borderRadius="lg"
          as={Link}
          href={`/collection/${nftContract.chain.id}/${
            nftContract.address
          }/token/${item.asset.id.toString()}`}
          _hover={{ 
            textDecoration: "none",
            transform: "translateY(-4px)",
            transition: "transform 0.2s ease",
            boxShadow: "md"
          }}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
          h="100%"
        >
          <Flex direction="column" h="100%">
            <Box overflow="hidden" position="relative" pb="100%">
              <MediaRenderer 
                client={client} 
                src={item.asset.metadata.image}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </Box>
            <Box p={3} flex="1">
              <Text 
                fontWeight="semibold" 
                color={textColor}
                noOfLines={1}
                fontSize="sm"
                mb={1}
              >
                {item.asset?.metadata?.name ?? "Unknown item"}
              </Text>
              <HStack spacing={1}>
                <Text fontSize="xs" color={secondaryTextColor}>Price:</Text>
                <Text fontWeight="medium" fontSize="sm">
                  {toEther(item.pricePerToken)}{" "}
                  {item.currencyValuePerToken.symbol}
                </Text>
              </HStack>
            </Box>
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );
}
