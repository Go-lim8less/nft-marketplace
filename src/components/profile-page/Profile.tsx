import {
  Box,
  Flex,
  Heading,
  Img,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  Text,
  useBreakpointValue,
  Container,
  useColorModeValue,
  Avatar,
  Badge,
  HStack,
  VStack,
  Icon,
  Card,
  CardBody,
  TabIndicator,
  Divider,
  Button,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { blo } from "blo";
import { shortenAddress } from "thirdweb/utils";
import type { Account } from "thirdweb/wallets";
import { ProfileMenu } from "./Menu";
import { useState } from "react";
import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getContract, toEther } from "thirdweb";
import { client } from "@/consts/client";
import { getOwnedERC721s } from "@/extensions/getOwnedERC721s";
import { OwnedItem } from "./OwnedItem";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { Link } from "@chakra-ui/next-js";
import { getOwnedERC1155s } from "@/extensions/getOwnedERC1155s";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { FaEthereum, FaExternalLinkAlt, FaClipboard } from "react-icons/fa";
import { MdCollections } from "react-icons/md";

type Props = {
  address: string;
};

export function ProfileSection(props: Props) {
  const { address } = props;
  const account = useActiveAccount();
  const isYou = address.toLowerCase() === account?.address.toLowerCase();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedCollection, setSelectedCollection] = useState<NftContract>(
    NFT_CONTRACTS[0]
  );
  const contract = getContract({
    address: selectedCollection.address,
    chain: selectedCollection.chain,
    client,
  });

  const {
    data,
    error,
    isLoading: isLoadingOwnedNFTs,
  } = useReadContract(
    selectedCollection.type === "ERC1155" ? getOwnedERC1155s : getOwnedERC721s,
    {
      contract,
      owner: address,
      requestPerSec: 50,
      queryOptions: {
        enabled: !!address,
      },
    }
  );

  const chain = contract.chain;
  const marketplaceContractAddress = MARKETPLACE_CONTRACTS.find(
    (o) => o.chain.id === chain.id
  )?.address;
  if (!marketplaceContractAddress) throw Error("No marketplace contract found");
  const marketplaceContract = getContract({
    address: marketplaceContractAddress,
    chain,
    client,
  });
  const { data: allValidListings, isLoading: isLoadingValidListings } =
    useReadContract(getAllValidListings, {
      contract: marketplaceContract,
      queryOptions: { enabled: data && data.length > 0 },
    });
  const listings = allValidListings?.length
    ? allValidListings.filter(
        (item) =>
          item.assetContractAddress.toLowerCase() ===
            contract.address.toLowerCase() &&
          item.creatorAddress.toLowerCase() === address.toLowerCase()
      )
    : [];
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });
  
  const cardBg = useColorModeValue("white", "card.dark");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const highlightColor = useColorModeValue("brand.500", "brand.300");
  
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    // Would add toast notification here in a full implementation
  };
  
  return (
    <Container maxW="1400px" py={{ base: 8, md: 12 }}>
      <Card 
        bg={cardBg} 
        borderRadius="xl" 
        mb={8} 
        boxShadow="sm"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        <Box 
          height="120px" 
          bg="brand.500" 
          bgGradient="linear(to-r, brand.400, brand.600)"
        />
        <CardBody px={{ base: 4, md: 8 }} pb={6} pt={0}>
          <Flex 
            direction={{ base: "column", md: "row" }} 
            mt={-16}
            gap={{ base: 4, md: 6 }}
            align={{ md: "flex-end" }}
            mb={6}
          >
            <Avatar
              src={ensAvatar ?? blo(address as `0x${string}`)}
              size="2xl"
              borderWidth="4px"
              borderColor={cardBg}
              bg={cardBg}
            />
            <Box flex={1} mt={{ base: 4, md: 0 }}>
              <HStack spacing={2} mb={1} flexWrap="wrap">
                <Heading size={{ base: "lg", md: "xl" }}>
                  {ensName ?? "Unnamed"}
                </Heading>
                {isYou && (
                  <Badge colorScheme="brand" fontSize="sm">
                    You
                  </Badge>
                )}
              </HStack>
              <HStack spacing={2} color={textColor}>
                <Text fontSize="sm">
                  {shortenAddress(address)}
                </Text>
                <Button 
                  size="xs" 
                  variant="ghost" 
                  onClick={copyAddress} 
                  aria-label="Copy address"
                >
                  <Icon as={CopyIcon} />
                </Button>
              </HStack>
            </Box>
          </Flex>
        </CardBody>
      </Card>

      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Box
          position={{ base: "relative", md: "sticky" }}
          top={{ md: "100px" }}
          height={{ md: "fit-content" }}
          width={{ base: "100%", md: "250px" }}
        >
          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
          >
            <CardBody py={4}>
              <HStack spacing={2} mb={4} align="center">
                <Icon as={MdCollections} color={highlightColor} boxSize={5} />
                <Heading size="md">Collections</Heading>
              </HStack>
              <ProfileMenu
                selectedCollection={selectedCollection}
                setSelectedCollection={setSelectedCollection}
              />
            </CardBody>
          </Card>
        </Box>
        
        <Box flex={1}>
          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
          >
            <CardBody>
              <Flex direction="column" gap={4}>
                <Flex 
                  justify="space-between" 
                  align="center" 
                  wrap="wrap"
                  gap={3}
                >
                  <HStack flex="1" minW="0">
                    <Icon as={MdCollections} color={highlightColor} boxSize={5} flexShrink={0} />
                    <Heading 
                      size="md"
                      isTruncated
                      title={selectedCollection.title}
                    >
                      {selectedCollection.title}
                    </Heading>
                  </HStack>
                  
                  <Link
                    href={`/collection/${selectedCollection.chain.id}/${selectedCollection.address}`}
                    display="flex"
                    alignItems="center"
                    fontSize="sm"
                    color={highlightColor}
                    _hover={{ textDecoration: "none", opacity: 0.8 }}
                    flexShrink={0}
                    aria-label="View collection details"
                  >
                    View collection <Icon as={FaExternalLinkAlt} ml={1} />
                  </Link>
                </Flex>
                
                <Tabs
                  variant="unstyled"
                  onChange={(index) => setTabIndex(index)}
                  isLazy
                  defaultIndex={0}
                  colorScheme="brand"
                >
                  <TabList gap={4}>
                    <Tab 
                      fontWeight="medium" 
                      _selected={{ color: highlightColor, fontWeight: "semibold" }}
                    >
                      Owned ({data?.length || 0})
                    </Tab>
                    <Tab
                      fontWeight="medium"
                      _selected={{ color: highlightColor, fontWeight: "semibold" }}
                    >
                      Listings ({listings.length || 0})
                    </Tab>
                  </TabList>
                  <TabIndicator
                    mt="-1.5px"
                    height="2px"
                    bg="brand.500"
                    borderRadius="1px"
                  />
                  
                  <Box mt={6}>
                    {isLoadingOwnedNFTs ? (
                      <SimpleGrid columns={columns} spacing={6}>
                        {[...Array(4)].map((_, i) => (
                          <Box key={i}>
                            <Skeleton height="200px" width="100%" borderRadius="lg" />
                            <SkeletonText mt={4} noOfLines={2} spacing={2} />
                          </Box>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <>
                        {tabIndex === 0 ? (
                          <>
                            {data && data.length > 0 ? (
                              <SimpleGrid columns={columns} spacing={6}>
                                {data?.map((item) => (
                                  <OwnedItem
                                    key={item.id.toString()}
                                    nftCollection={contract}
                                    nft={item}
                                  />
                                ))}
                              </SimpleGrid>
                            ) : (
                              <Box 
                                py={8} 
                                textAlign="center" 
                                color={textColor}
                              >
                                <Text>
                                  {isYou
                                    ? "You"
                                    : ensName
                                    ? ensName
                                    : shortenAddress(address)}{" "}
                                  {isYou ? "do" : "does"} not own any NFTs in this
                                  collection
                                </Text>
                              </Box>
                            )}
                          </>
                        ) : (
                          <>
                            {listings && listings.length > 0 ? (
                              <SimpleGrid columns={columns} spacing={6}>
                                {listings?.map((item) => (
                                  <Box
                                    key={item.id.toString()}
                                    as={Link}
                                    href={`/collection/${contract.chain.id}/${
                                      contract.address
                                    }/token/${item.asset.id.toString()}`}
                                    _hover={{ 
                                      textDecoration: "none",
                                      transform: "translateY(-4px)",
                                      transition: "transform 0.2s ease",
                                      boxShadow: "md"
                                    }}
                                    borderRadius="lg"
                                    overflow="hidden"
                                    bg={cardBg}
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                  >
                                    <Box overflow="hidden" borderRadius="lg">
                                      <MediaRenderer
                                        client={client}
                                        src={item.asset.metadata.image}
                                        style={{
                                          position: "relative",
                                          width: "100%",
                                          height: "100%",
                                          aspectRatio: "1",
                                          objectFit: "cover"
                                        }}
                                      />
                                    </Box>
                                    <Box p={4}>
                                      <Text 
                                        fontWeight="semibold" 
                                        fontSize="md" 
                                        noOfLines={1}
                                      >
                                        {item.asset?.metadata?.name ?? "Unknown item"}
                                      </Text>
                                      <HStack spacing={1} mt={2}>
                                        <Text fontSize="sm" color={textColor}>Price:</Text>
                                        <Text fontWeight="medium">
                                          {toEther(item.pricePerToken)}{" "}
                                          {item.currencyValuePerToken.symbol}
                                        </Text>
                                      </HStack>
                                    </Box>
                                  </Box>
                                ))}
                              </SimpleGrid>
                            ) : (
                              <Box 
                                py={8} 
                                textAlign="center" 
                                color={textColor}
                              >
                                {isYou ? (
                                  <Text>You do not have any listings in this collection</Text>
                                ) : (
                                  <Text>
                                    {ensName ? ensName : shortenAddress(address)} does not 
                                    have any listings in this collection
                                  </Text>
                                )}
                              </Box>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </Box>
                </Tabs>
              </Flex>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Container>
  );
}
