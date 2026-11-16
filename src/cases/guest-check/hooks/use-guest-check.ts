import { useQuery } from "@tanstack/react-query"
import { GuestCheckService } from "../services/guest-check.service"

export function useOpenedGuestChecks() {
  return useQuery({
    queryKey: ["guest-checks"],
    queryFn: () => GuestCheckService.listOpened(),
  })
}