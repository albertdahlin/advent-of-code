
CC_FLAGS=
ZIG_FLAGS=

SRC_C=$(wildcard c/*/*.c)
SRC_ZIG=$(wildcard zig/*/*.zig)

OUT=$(SRC_C:c/%.c=bin/%.c) $(SRC_ZIG:zig/%.zig=bin/%.zig)
DIR=$(dir $(OUT))


dev: CC_FLAGS+=-g -Wall -Wextra -Wpedantic
dev: all

optimize: CC_FLAGS+=-O3 -s
optimize: ZIG_FLAGS+=-O ReleaseFast
optimize: all

all: $(DIR) $(OUT)

bin/%.c: c/%.c c/*.c
	gcc -o $@ $< $(CC_FLAGS)


bin/%.zig: zig/%.zig
	zig build-exe $< $(ZIG_FLAGS) -femit-bin=$@

bin/%:
	mkdir -p $@


clean:
	rm -rf bin

