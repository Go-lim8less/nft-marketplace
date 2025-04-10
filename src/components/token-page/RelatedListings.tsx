import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Flex,
	Text,
	useColorModeValue,
	HStack,
} from "@chakra-ui/react";
import { toEther } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

export default function RelatedListings({
	excludedListingId,
}: {
	excludedListingId: bigint;
}) {
	const { nftContract, allValidListings } = useMarketplaceContext();
	const listings = allValidListings?.filter(
		(o) =>
			o.id !== excludedListingId &&
			o.assetContractAddress.toLowerCase() ===
				nftContract.address.toLowerCase(),
	);
	
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.700", "gray.300");
	
	if (!listings || !listings.length) return <></>;
	return (
		<AccordionItem>
			<Text>
				<AccordionButton>
					<Box as="span" flex="1" textAlign="left">
						More from this collection
					</Box>
					<AccordionIcon />
				</AccordionButton>
			</Text>
			<AccordionPanel pb={4}>
				<Box
					display="flex"
					overflowX="auto"
					whiteSpace="nowrap"
					padding="3"
					width="100%"
					gap="3"
					sx={{
						"&::-webkit-scrollbar": {
							height: "8px",
							borderRadius: "8px",
							backgroundColor: `rgba(0, 0, 0, 0.05)`,
						},
						"&::-webkit-scrollbar-thumb": {
							backgroundColor: `rgba(0, 0, 0, 0.1)`,
							borderRadius: "8px",
						},
					}}
				>
					{listings?.map((item) => (
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
								transition: "all 0.2s ease",
								boxShadow: "md"
							}}
							minW="200px"
							maxW="200px"
							bg={cardBg}
							borderWidth="1px"
							borderColor={borderColor}
							overflow="hidden"
						>
							<Flex direction="column">
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
								<Box p={3}>
									<Text 
										fontWeight="semibold" 
										color={textColor} 
										mb={1}
										noOfLines={1}
										fontSize="sm"
									>
										{item.asset.metadata?.name ?? "Unknown item"}
									</Text>
									<HStack spacing={1}>
										<Text fontSize="xs" opacity={0.8}>Price:</Text>
										<Text fontWeight="medium" fontSize="sm">
											{toEther(item.pricePerToken)}{" "}
											{item.currencyValuePerToken.symbol}
										</Text>
									</HStack>
								</Box>
							</Flex>
						</Box>
					))}
				</Box>
			</AccordionPanel>
		</AccordionItem>
	);
}
