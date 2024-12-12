"use client"

import { TabsContent } from "@radix-ui/react-tabs"
import { RowData } from "@tanstack/react-table"

import { FakeMember, Group, Member } from "@/types/fansub"
import { AdvancedTable } from "@/components/ui/advanced-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { columns as fakeMembersColumns } from "./fake-members-table/columns"
import { columns } from "./members-table/columns"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateMemberData?: (member: Member) => void
    deleteMemberRow?: (member: Member) => void
    addFakeMemberData?: (member: FakeMember) => void
    deleteFakeMemberRow?: (member: FakeMember) => void
    group?: Group
  }
}

interface MembersSettingsProps {
  group: Group
}

export function MembersSettings({ group }: MembersSettingsProps) {
  return (
    <Tabs
      defaultValue="members"
      className="flex h-full flex-col overflow-hidden"
    >
      <TabsList className="mb-2 w-full">
        <TabsTrigger value="members" className="w-full">
          Członkowie
        </TabsTrigger>
        <TabsTrigger value="fake-members" className="w-full">
          Członkowie widmo
        </TabsTrigger>
      </TabsList>
      <TabsContent value="members" className="overflow-hidden">
        <div className="flex h-full flex-col gap-3">
          <AdvancedTable
            columns={columns}
            generateMeta={({ setData }) => ({
              group: group,
              deleteMemberRow: (member: Member) => {
                setData((old) =>
                  old.filter((m) => m.username !== member.username)
                )
              },
              updateMemberData: (member: Member) =>
                setData((old) =>
                  old.map((row) => {
                    if (row.id === member.id) return member

                    return row
                  })
                ),
            })}
            initData={group.members}
          />
        </div>
      </TabsContent>
      <TabsContent value="fake-members" className="overflow-hidden">
        <div className="flex h-full flex-col gap-3">
          <AdvancedTable
            columns={fakeMembersColumns}
            generateMeta={({ setData }) => ({
              group: group,
              deleteFakeMemberRow: (member: FakeMember) => {
                setData((old) => old.filter((m) => m.id !== member.id))
              },
              addFakeMemberData: (member: FakeMember) =>
                setData((old) => [...old, member]),
            })}
            initData={group.fakeMembers || []}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
