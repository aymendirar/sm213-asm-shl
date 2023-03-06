# Example dervied from the CPSC 213 Companion, Appendix C

.pos 0x100
  ld $0x1000, r1
  ld $a, r1
  ld $arr, r1
  ld $label_with_underscores, r1
  ld $-42, r4
  ld 4(r2), r3
  ld (r1, r2, 4), r3
  st r1, 8(r3)
  st r1, (r2, r3, 4)
  halt
  nop
  mov r1, r2
  add r1, r2
  and r1, r2
  inc r1
  inca r1
  dec r1
  deca r1
  not r1
  shl $2, r1
  shr $2, r1
  br 0x1008
  beq r1, 0x1008
  bgt r1, 0x1008
  j 0x1000
  gpc $6, r1
  j 8(r1)
  j *8(r1)
  j *(r1, r2, 4)
  sys $2

.pos 0x1000
a:    .long 0xffffffff # a

.pos 0x2000
arr:    .long 0xffffffff # arr[0]
        .long 0x00000000 # arr[1]