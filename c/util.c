#pragma once
#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>

#define isDigit(c) (c >= '0' && c <= '9')

typedef struct Buffer {
    uint8_t *data;
    size_t len;
    size_t cap;
} Buffer_t;


Buffer_t Buffer_fromFile(FILE *fd) {
    fseek(fd, 0, SEEK_END);

    size_t len = ftell(fd);

    fseek(fd, 0, SEEK_SET);
    Buffer_t buf = {0};
    buf.data = malloc(len);
    buf.len = fread(buf.data, 1, len, fd);
    buf.cap = len;

    return buf;
}

void Buffer_free(Buffer_t buf) {
    free(buf.data);
}
