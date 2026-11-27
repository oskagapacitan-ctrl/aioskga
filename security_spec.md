# Security Specification: OSIS SMKN 3 Pacitan Portal

## 1. Data Invariants
1. **Batch Integrity**: Only verified OSIS admins can create, modify, or delete `/batches/{batchId}`. Document IDs must match `^[a-zA-Z0-9_-]+$` and `<= 128` chars.
2. **Memory Relational & Identity Integrity**: A `/memories/{memoryId}` document cannot exist without a valid existing `/batches/{batchId}` (`exists(...)` verified on create). `authorUid` must strictly equal `request.auth.uid`, `email_verified` must be `true`, and `authorUid`/`batchId`/`createdAt` are immutable after creation.
3. **Feedback Privacy & Workflow Integrity**: A `/feedback/{feedbackId}` document must belong to `request.auth.uid` on create, initialize with `status == 'Baru'` and `adminReply == ''`, and private feedback (`isPublic == false`) may only be read by its `authorUid` or an OSIS admin. Only an OSIS admin can modify `status` or `adminReply`.
4. **Events & Settings Protection**: Only verified OSIS admins can write to `/events/{eventId}`, `/settings/{settingId}`, and `/admins/{adminId}`.
5. **Temporal Integrity**: All `createdAt` and `updatedAt` timestamps must equal `request.time`.

## 2. The "Dirty Dozen" Attack Payloads (All Must Yield PERMISSION_DENIED)
1. **Unauthenticated Memory Create**: `create /memories/m1` with `request.auth == null`.
2. **Unverified Email Memory Create**: `create /memories/m2` with `email_verified == false`.
3. **Orphaned Batch Reference**: `create /memories/m3` referencing non-existent `batchId: "angkatan-9999"`.
4. **Identity Spoofing on Memory**: `create /memories/m4` where `authorUid != request.auth.uid`.
5. **Shadow Field Injection on Memory**: `create /memories/m5` with extra key `isPinned: true`.
6. **Oversized String Poisoning**: `create /memories/m6` with `message` > 600 chars or invalid doc ID `m$bad!`.
7. **Feedback Status Bypass on Create**: `create /feedback/f1` attempting to set `status: "Selesai"` or non-empty `adminReply`.
8. **Non-Admin Feedback Reply Hijack**: `update /feedback/f2` by regular user trying to change `status` or `adminReply`.
9. **Private Feedback Leak (Read)**: `get /feedback/f3` where `isPublic == false` by non-owner, non-admin user.
10. **Non-Admin Event Injection**: `create /events/e1` by student user.
11. **Admin Privilege Escalation**: `create /admins/attackerUid` by non-admin user.
12. **Client-Forged Timestamp**: `create /memories/m7` where `createdAt` is a client timestamp != `request.time`.
