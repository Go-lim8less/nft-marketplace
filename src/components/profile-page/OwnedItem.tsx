import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/consts/client";
import { useMemo } from "react";

type Props = {
  nftCollection: any;
  nft: any;
};

export function OwnedItem(props: Props) {
  const { nftCollection, nft } = props;
  
  // Memoized values for better performance
  const cardBg = useColorModeValue("white", "card.dark");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const targetHref = useMemo(() => {
    return `/collection/${nftCollection.chain.id}/${
      nftCollection.address
    }/token/${nft.id.toString()}`;
  }, [nftCollection.chain.id, nftCollection.address, nft.id]);
  
  const displayName = nft.metadata?.name ?? `#${nft.id.toString()}`;
  
  // Static style props to avoid recreation on render
  const imageStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    aspectRatio: "1",
    objectFit: "cover"
  } as const;
  
  const hoverStyle = {
    textDecoration: "none",
    transform: "translateY(-4px)",
    transition: "transform 0.2s ease",
    boxShadow: "md"
  };
  
  return (
    <Box
      as={Link}
      href={targetHref}
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      _hover={hoverStyle}
    >
      <Box overflow="hidden" borderRadius="lg">
        <MediaRenderer
          client={client}
          src={nft.metadata.image}
          style={imageStyle}
        />
      </Box>
      <Box p={4}>
        <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
          {displayName}
        </Text>
        {/* Only add ID if it's not already in the name */}
        {!nft.metadata?.name?.includes(nft.id.toString()) && (
          <Text fontSize="xs" color="gray.500">
            #{nft.id.toString()}
          </Text>
        )}
      </Box>
    </Box>
  );
}
