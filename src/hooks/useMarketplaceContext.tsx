"use client";

import { client } from "@/consts/client";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { SUPPORTED_TOKENS, Token } from "@/consts/supported_tokens";
import {
  getSupplyInfo,
  SupplyInfo,
} from "@/extensions/getLargestCirculatingTokenId";
import { Box, Spinner } from "@chakra-ui/react";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { getContract, type ThirdwebContract } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isERC1155 } from "thirdweb/extensions/erc1155";
import { isERC721 } from "thirdweb/extensions/erc721";
import {
  type DirectListing,
  type EnglishAuction,
  getAllAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";

export type NftType = "ERC1155" | "ERC721";

const SUPPORT_AUCTION = false;

type TMarketplaceContext = {
  marketplaceContract: ThirdwebContract;
  nftContract: ThirdwebContract;
  type: NftType;
  isLoading: boolean;
  allValidListings: DirectListing[] | undefined;
  allAuctions: EnglishAuction[] | undefined;
  contractMetadata:
    | {
        [key: string]: any;
        name: string;
        symbol: string;
      }
    | undefined;
  refetchAllListings: Function;
  isRefetchingAllListings: boolean;
  listingsInSelectedCollection: DirectListing[];
  supplyInfo: SupplyInfo | undefined;
  supportedTokens: Token[];
};

const MarketplaceContext = createContext<TMarketplaceContext | undefined>(
  undefined
);

export default function MarketplaceProvider({
  chainId,
  contractAddress,
  children,
}: {
  chainId: string;
  contractAddress: string;
  children: ReactNode;
}) {
  // Parse chain ID only once
  const _chainId: number = useMemo(() => {
    try {
      return Number.parseInt(chainId);
    } catch (err) {
      throw new Error("Invalid chain ID");
    }
  }, [chainId]);
  
  // Find marketplace contract only once
  const marketplaceContract = useMemo(() => {
    const contract = MARKETPLACE_CONTRACTS.find(
      (item) => item.chain.id === _chainId
    );
    if (!contract) {
      throw new Error("Marketplace not supported on this chain");
    }
    return contract;
  }, [_chainId]);

  // Create contracts once
  const { contract, marketplace } = useMemo(() => {
    return {
      contract: getContract({
        chain: marketplaceContract.chain,
        client,
        address: contractAddress,
      }),
      marketplace: getContract({
        address: marketplaceContract.address,
        chain: marketplaceContract.chain,
        client,
      })
    };
  }, [marketplaceContract, contractAddress]);

  // Check NFT type with proper query caching
  const { data: is721, isLoading: isChecking721 } = useReadContract(isERC721, {
    contract,
    queryOptions: {
      enabled: !!marketplaceContract,
    },
  });
  
  const { data: is1155, isLoading: isChecking1155 } = useReadContract(
    isERC1155,
    { 
      contract, 
      queryOptions: { 
        enabled: !!marketplaceContract,
      } 
    }
  );

  const isNftCollection = is1155 || is721;

  if (!isNftCollection && !isChecking1155 && !isChecking721)
    throw new Error("Not a valid NFT collection");

  // Get contract metadata with proper caching
  const { data: contractMetadata, isLoading: isLoadingContractMetadata } =
    useReadContract(getContractMetadata, {
      contract,
      queryOptions: {
        enabled: isNftCollection,
      },
    });

  // Get listings with caching
  const {
    data: allValidListings,
    isLoading: isLoadingValidListings,
    refetch: refetchAllListings,
    isRefetching: isRefetchingAllListings,
  } = useReadContract(getAllValidListings, {
    contract: marketplace,
    queryOptions: {
      enabled: isNftCollection,
    },
  });

  // Memoize filtered listings to prevent recalculation
  const listingsInSelectedCollection = useMemo(() => {
    return allValidListings?.length
      ? allValidListings.filter(
          (item) =>
            item.assetContractAddress.toLowerCase() ===
            contract.address.toLowerCase()
        )
      : [];
  }, [allValidListings, contract.address]);

  // Fetch auctions only if necessary
  const { data: allAuctions, isLoading: isLoadingAuctions } = useReadContract(
    getAllAuctions,
    {
      contract: marketplace,
      queryOptions: { 
        enabled: isNftCollection && SUPPORT_AUCTION,
      },
    }
  );

  // Get supply info with caching
  const { data: supplyInfo, isLoading: isLoadingSupplyInfo } = useReadContract(
    getSupplyInfo,
    {
      contract,
    }
  );

  const isLoading =
    isChecking1155 ||
    isChecking721 ||
    isLoadingAuctions ||
    isLoadingContractMetadata ||
    isLoadingValidListings ||
    isLoadingSupplyInfo;

  // Memoize supported tokens
  const supportedTokens: Token[] = useMemo(() => {
    return SUPPORTED_TOKENS.find(
      (item) => item.chain.id === marketplaceContract.chain.id
    )?.tokens || [];
  }, [marketplaceContract.chain.id]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    marketplaceContract: marketplace,
    nftContract: contract,
    isLoading,
    type: is1155 ? "ERC1155" : "ERC721" as NftType,
    allValidListings,
    allAuctions,
    contractMetadata,
    refetchAllListings,
    isRefetchingAllListings,
    listingsInSelectedCollection,
    supplyInfo,
    supportedTokens,
  }), [
    marketplace, 
    contract, 
    isLoading, 
    is1155, 
    allValidListings, 
    allAuctions, 
    contractMetadata, 
    refetchAllListings, 
    isRefetchingAllListings, 
    listingsInSelectedCollection, 
    supplyInfo, 
    supportedTokens
  ]);

  return (
    <MarketplaceContext.Provider value={contextValue}>
      {children}
      {isLoading && (
        <Box
          position="fixed"
          bottom="10px"
          right="10px"
          backgroundColor="rgba(0, 0, 0, 0.7)"
          padding="10px"
          borderRadius="md"
          zIndex={1000}
        >
          <Spinner size="lg" color="purple" />
        </Box>
      )}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplaceContext() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error(
      "useMarketplaceContext must be used inside MarketplaceProvider"
    );
  }
  return context;
}