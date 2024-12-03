
const std = @import("std");

pub fn main() !void {
    const stdin = std.io.getStdIn().reader();
    const stdout = std.io.getStdOut().writer();

    var left: [1000]i32 = undefined;
    var right: [1000]i32 = undefined;

    var buf: [1024]u8 = undefined;
    var len: usize = 0;

    while (try stdin.readUntilDelimiterOrEof(&buf, '\n')) |line| {
        var parts = std.mem.tokenizeScalar(u8, line, ' ');

        const l = try std.fmt.parseInt(i32, parts.next().?, 10);
        const r = try std.fmt.parseInt(i32, parts.next().?, 10);

        left[len] = l;
        right[len] = r;

        len += 1;
    }


    // Part 1

    std.sort.heap(i32, left[0..len], {}, comptime std.sort.asc(i32));
    std.sort.heap(i32, right[0..len], {}, comptime std.sort.asc(i32));

    var result: u32 = 0;
    var i: usize = 0;
    while (i < len) : (i += 1) {
        result += @abs(left[i] - right[i]);
    }

    try stdout.print("{d}\n", .{result});


    // Part 2

    var freq = std.AutoHashMap(i32, u32).init(std.heap.page_allocator);
    defer freq.deinit();

    for (right[0..len]) |r| {
        const count = freq.get(r) orelse 0;
        try freq.put(r, count + 1);
    }

    result = 0;

    for (left[0..len]) |l| {
        const f = freq.get(l) orelse 0;
        result += @as(u32, @intCast(l)) * f;
    }

    try stdout.print("{d}\n", .{result});
}
