import { NATIVE_TOKEN_ICON_MAP, Token } from "@/consts/supported_tokens";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Image,
  useToast,
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Badge,
  FormHelperText,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { NATIVE_TOKEN_ADDRESS, sendAndConfirmTransaction } from "thirdweb";
import {
  isApprovedForAll as isApprovedForAll1155,
  setApprovalForAll as setApprovalForAll1155,
} from "thirdweb/extensions/erc1155";
import {
  isApprovedForAll as isApprovedForAll721,
  setApprovalForAll as setApprovalForAll721,
} from "thirdweb/extensions/erc721";
import { createListing } from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

type Props = {
  tokenId: bigint;
  account: Account;
};

export function CreateListing(props: Props) {
  const priceRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const expirationRef = useRef<HTMLInputElement>(null);
  const { tokenId, account } = props;
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const [currency, setCurrency] = useState<Token>();
  const toast = useToast();
  const [hasDuplicateListing, setHasDuplicateListing] = useState(false);
  const [minExpirationDate, setMinExpirationDate] = useState("");

  const {
    nftContract,
    marketplaceContract,
    refetchAllListings,
    type,
    supportedTokens,
    listingsInSelectedCollection,
  } = useMarketplaceContext();
  const chain = marketplaceContract.chain;

  const nativeToken: Token = {
    tokenAddress: NATIVE_TOKEN_ADDRESS,
    symbol: chain.nativeCurrency?.symbol || "NATIVE TOKEN",
    icon: NATIVE_TOKEN_ICON_MAP[chain.id] || "",
  };

  const options: Token[] = [nativeToken].concat(supportedTokens);

  // Check for existing listings by this user for this token
  useEffect(() => {
    // Filter listings for this specific token
    const tokenListings = listingsInSelectedCollection.filter(
      (item) =>
        item.assetContractAddress.toLowerCase() === nftContract.address.toLowerCase() && 
        item.asset.id === tokenId &&
        item.creatorAddress.toLowerCase() === account.address.toLowerCase()
    );
    
    // Set duplicate flag if any existing listings by this user for this token
    setHasDuplicateListing(tokenListings.length > 0);
    
    // Set minimum expiration date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinExpirationDate(tomorrow.toISOString().substring(0, 16)); // Format: YYYY-MM-DDThh:mm
  }, [tokenId, account.address, nftContract.address, listingsInSelectedCollection]);

  if (hasDuplicateListing) {
    return (
      <Box mt={4} p={4} borderRadius="md" bg="red.50" color="red.700">
        <Badge colorScheme="red" mb={2}>Listing Already Exists</Badge>
        <Text>
          You already have an active listing for this NFT. 
          Please cancel your existing listing before creating a new one.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <br />
      <Flex direction="column" w={{ base: "90vw", lg: "430px" }} gap="10px">
        {type === "ERC1155" ? (
          <>
            <Flex
              direction="row"
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Box>
                <Text>Price</Text>
                <Input
                  type="number"
                  ref={priceRef}
                  placeholder="Enter a price"
                />
              </Box>
              <Box>
                <Text>Quantity</Text>
                <Input
                  type="number"
                  ref={qtyRef}
                  defaultValue={1}
                  placeholder="Quantity to sell"
                />
              </Box>
            </Flex>
          </>
        ) : (
          <>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                ref={priceRef}
                placeholder="Enter a price for your listing"
              />
            </FormControl>
          </>
        )}
        
        <FormControl mt={2}>
          <FormLabel>Currency</FormLabel>
          <Menu>
            <MenuButton minH="48px" as={Button} rightIcon={<ChevronDownIcon />}>
              {currency ? (
                <Flex direction="row">
                  <Image
                    boxSize="2rem"
                    borderRadius="full"
                    src={currency.icon}
                    mr="12px"
                  />
                  <Text my="auto">{currency.symbol}</Text>
                </Flex>
              ) : (
                "Select currency"
              )}
            </MenuButton>
            <MenuList>
              {options.map((token) => (
                <MenuItem
                  minH="48px"
                  key={token.tokenAddress}
                  onClick={() => setCurrency(token)}
                  display={"flex"}
                  flexDir={"row"}
                >
                  <Image
                    boxSize="2rem"
                    borderRadius="full"
                    src={token.icon}
                    ml="2px"
                    mr="14px"
                  />
                  <Text my="auto">{token.symbol}</Text>
                  {token.tokenAddress.toLowerCase() ===
                    currency?.tokenAddress.toLowerCase() && (
                    <CheckIcon ml="auto" />
                  )}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </FormControl>
        
        <FormControl mt={2}>
          <FormLabel>Expiration Date & Time</FormLabel>
          <Input
            type="datetime-local"
            ref={expirationRef}
            min={minExpirationDate}
            defaultValue={minExpirationDate}
          />
          <FormHelperText>When should this listing expire?</FormHelperText>
        </FormControl>
        
        <Button
          mt={4}
          colorScheme="brand"
          isDisabled={!currency}
          onClick={async () => {
            const value = priceRef.current?.value;
            if (!value) {
              return toast({
                title: "Please enter a price for this listing",
                status: "error",
                isClosable: true,
                duration: 5000,
              });
            }
            if (!currency) {
              return toast({
                title: `Please select a currency for the listing`,
                status: "error",
                isClosable: true,
                duration: 5000,
              });
            }
            
            // Check expiration date
            const expirationDate = expirationRef.current?.value;
            if (!expirationDate) {
              return toast({
                title: "Please set an expiration date/time",
                status: "error",
                isClosable: true,
                duration: 5000,
              });
            }
            
            // Convert to seconds since epoch for blockchain
            const expirationSeconds = Math.floor(new Date(expirationDate).getTime() / 1000);
            const currentSeconds = Math.floor(Date.now() / 1000);
            
            // Ensure expiration is in the future (at least 1 hour)
            if (expirationSeconds <= currentSeconds + 3600) {
              return toast({
                title: "Expiration time must be at least 1 hour in the future",
                status: "error",
                isClosable: true,
                duration: 5000,
              });
            }
            
            if (activeChain?.id !== nftContract.chain.id) {
              await switchChain(nftContract.chain);
            }
            const _qty = BigInt(qtyRef.current?.value ?? 1);
            if (type === "ERC1155") {
              if (!_qty || _qty <= 0n) {
                return toast({
                  title: "Error",
                  description: "Invalid quantity",
                  status: "error",
                  isClosable: true,
                  duration: 5000,
                });
              }
            }

            // Check for approval
            const checkApprove =
              type === "ERC1155" ? isApprovedForAll1155 : isApprovedForAll721;

            const isApproved = await checkApprove({
              contract: nftContract,
              owner: account.address,
              operator: marketplaceContract.address,
            });

            if (!isApproved) {
              const setApproval =
                type === "ERC1155"
                  ? setApprovalForAll1155
                  : setApprovalForAll721;

              const approveTx = setApproval({
                contract: nftContract,
                operator: marketplaceContract.address,
                approved: true,
              });

              await sendAndConfirmTransaction({
                transaction: approveTx,
                account,
              });
            }

            const transaction = createListing({
              contract: marketplaceContract,
              assetContractAddress: nftContract.address,
              tokenId,
              quantity: type === "ERC721" ? 1n : _qty,
              currencyContractAddress: currency?.tokenAddress,
              pricePerToken: value,
              startTimestamp: new Date(currentSeconds * 1000),
              endTimestamp: new Date(expirationSeconds * 1000),
            });

            await sendAndConfirmTransaction({
              transaction,
              account,
            });
            refetchAllListings();
            
            toast({
              title: "Success!",
              description: "Your NFT has been listed for sale",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            
            // Set duplicate flag to prevent creating another listing
            setHasDuplicateListing(true);
          }}
        >
          List for Sale
        </Button>
      </Flex>
    </>
  );
}
