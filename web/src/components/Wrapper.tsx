import { Box } from "@chakra-ui/core";

interface props {
  variant?: "regular" | "small";
}

export const Wrapper: React.FC<props> = ({ children, variant = "regular" }) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  );
};
