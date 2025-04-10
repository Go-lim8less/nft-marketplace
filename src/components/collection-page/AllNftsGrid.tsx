"use client";

import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  SimpleGrid,
  useBreakpointValue,
  Text,
  Button,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { getNFTs as getNFTs1155 } from "thirdweb/extensions/erc1155";
import { getNFTs as getNFTs721 } from "thirdweb/extensions/erc721";
import { MediaRenderer, useReadContract } from "thirdweb/react";

export function AllNftsGrid() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const { nftContract, type, supplyInfo } = useMarketplaceContext();
  const startTokenId = supplyInfo?.startTokenId ?? 0n;
  const totalItems: bigint = supplyInfo
    ? supplyInfo.endTokenId - supplyInfo.startTokenId + 1n
    : 0n;
  const numberOfPages: number = Number(
    (totalItems + BigInt(itemsPerPage) - 1n) / BigInt(itemsPerPage)
  );
  const pages: { start: number; count: number }[] = [];

  for (let i = 0; i < numberOfPages; i++) {
    const currentStartTokenId = startTokenId + BigInt(i * itemsPerPage);
    const remainingItems = totalItems - BigInt(i * itemsPerPage);
    const count =
      remainingItems < BigInt(itemsPerPage)
        ? Number(remainingItems)
        : itemsPerPage;
    pages.push({ start: Number(currentStartTokenId), count: count });
  }
  const { data: allNFTs } = useReadContract(
    type === "ERC1155" ? getNFTs1155 : getNFTs721,
    {
      contract: nftContract,
      start: pages[currentPageIndex].start,
      count: pages[currentPageIndex].count,
    }
  );
  const len = allNFTs?.length ?? 0;
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

  console.log({ pages, currentPageIndex, length: pages.length });
  return (
    <>
      <SimpleGrid columns={columns} spacing={4} p={3} mx="auto" mt="16px">
        {allNFTs && allNFTs.length > 0 ? (
          allNFTs.map((item) => (
            <Box
              key={item.id.toString()}
              borderRadius="lg"
              as={Link}
              href={`/collection/${nftContract.chain.id}/${
                nftContract.address
              }/token/${item.id.toString()}`}
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
                    src={item.metadata.image}
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
                    {item.metadata?.name ?? "Unknown item"}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    #{item.id.toString()}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))
        ) : (
          <Box mx="auto" py={8} textAlign="center">Loading...</Box>
        )}
      </SimpleGrid>
      <Box
        mx="auto"
        maxW={{ base: "90vw", lg: "700px" }}
        mt="20px"
        px="10px"
        py="5px"
        overflowX="auto"
      >
        <Flex direction="row" justifyContent="center" gap="3">
          <Button
            onClick={() => setCurrentPageIndex(0)}
            isDisabled={currentPageIndex === 0}
            borderRadius="md"
            colorScheme="brand"
            variant="outline"
            size="sm"
          >
            <MdKeyboardDoubleArrowLeft />
          </Button>
          <Button
            isDisabled={currentPageIndex === 0}
            onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
            borderRadius="md"
            colorScheme="brand"
            variant="outline"
            size="sm"
          >
            <RiArrowLeftSLine />
          </Button>
          <Text my="auto" px={2}>
            Page {currentPageIndex + 1} of {pages.length}
          </Text>
          <Button
            isDisabled={currentPageIndex === pages.length - 1}
            onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
            borderRadius="md"
            colorScheme="brand"
            variant="outline"
            size="sm"
          >
            <RiArrowRightSLine />
          </Button>
          <Button
            onClick={() => setCurrentPageIndex(pages.length - 1)}
            isDisabled={currentPageIndex === pages.length - 1}
            borderRadius="md"
            colorScheme="brand"
            variant="outline"
            size="sm"
          >
            <MdKeyboardDoubleArrowRight />
          </Button>
        </Flex>
      </Box>
    </>
  );
}
