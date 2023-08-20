import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChevronsRight } from "react-feather";

export default function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; to?: string }>;
}) {
  return (
    <Breadcrumb
      m="6"
      spacing="1"
      separator={<Box size="1em" as={ChevronsRight} color="gray.300" />}
    >
      {items.map((item, index) => {
        const isCurrentPage = items.length === index + 1;
        return (
          <BreadcrumbItem isCurrentPage={isCurrentPage} key={item.label}>
            <BreadcrumbLink
              as={isCurrentPage ? undefined : Link}
              to={item.to ?? "#"}
            >
              {item.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
