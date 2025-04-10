import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Avatar,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  selectedCollection: NftContract;
  setSelectedCollection: Dispatch<SetStateAction<NftContract>>;
};

export function ProfileMenu(props: Props) {
  const { selectedCollection, setSelectedCollection } = props;
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const selectedBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  
  return (
    <VStack spacing={2} align="stretch">
      {NFT_CONTRACTS.map((item) => (
        <Button
          key={item.address}
          variant="ghost"
          justifyContent="flex-start"
          py={2.5}
          px={3}
          height="auto"
          borderRadius="md"
          bg={item.address === selectedCollection.address ? selectedBg : "transparent"}
          _hover={{ bg: hoverBg }}
          onClick={() => setSelectedCollection(item)}
          w="100%"
          transition="all 0.2s"
          color={textColor}
        >
          <HStack spacing={3} width="100%" align="center">
            <Avatar
              src={item.thumbnailUrl ?? ""}
              size="sm"
              borderRadius="md"
              bg="transparent"
              border="1px solid"
              borderColor={borderColor}
              flexShrink={0}
            />
            <Text
              fontWeight={item.address === selectedCollection.address ? "semibold" : "normal"}
              fontSize="sm"
              noOfLines={1}
              textAlign="left"
            >
              {item.title ?? "Unknown collection"}
            </Text>
          </HStack>
        </Button>
      ))}
    </VStack>
  );
}
