
CC_FLAGS = -Wall
ZIG_FLAGS = -O ReleaseFast

SRC_C = $(wildcard c/*/*.c)
SRC_ZIG = $(wildcard zig/*/*.zig)

OUT=$(SRC_C:c/%.c=build/%.c) $(SRC_ZIG:zig/%.zig=build/%.zig)
DIR=$(dir $(OUT))


all: $(DIR) $(OUT)

optimize: CC_FLAGS += -O3
optimize: all


build/%.c: c/%.c c/*.c
	gcc $(CC_FLAGS) -o $@ $<


build/%.zig: zig/%.zig
	zig build-exe $< $(ZIG_FLAGS) -femit-bin=$@

build/%:
	mkdir -p $@


clean:
	rm -rf build

