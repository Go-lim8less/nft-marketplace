import { Box, Flex, Text, useColorModeValue, Link, Avatar, HStack } from "@chakra-ui/react";
import { Link as NextLink } from "@chakra-ui/next-js";
import { type NftContract } from "@/consts/nft_contracts";

interface CollectionProps {
  item: NftContract;
}

export function Collection({ item }: CollectionProps) {
  const cardBg = useColorModeValue("white", "card.dark");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.500");
  
  return (
    <Flex
      as={NextLink}
      href={`/collection/${item.chain.id}/${item.address}`}
      alignItems="center"
      padding={3}
      _hover={{
        textDecoration: "none",
        transform: "translateY(-4px)",
        transition: "transform 0.2s ease",
        boxShadow: "md",
        bg: useColorModeValue("gray.50", "gray.700")
      }}
      gap={3}
      borderRadius="lg"
      background={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      w="100%"
      transition="all 0.2s"
    > 
      <Avatar
        src={item.thumbnailUrl ?? ""}
        size="md"
        borderRadius="md"
        bg="transparent"
        flexShrink={0}
        border="1px solid"
        borderColor={borderColor}
        objectFit="cover"
      />
      
      <Box width="calc(100% - 56px)" overflow="hidden">
        <Text 
          fontWeight="semibold" 
          fontSize="md"
          noOfLines={1}
          color={textColor}
          mb={1}
        >
          {item.title ?? "Unknown collection"}
        </Text>
        <Text fontSize="sm" color={secondaryTextColor}>
          {item.chain.name}
        </Text>
      </Box>
    </Flex>
  );
} 