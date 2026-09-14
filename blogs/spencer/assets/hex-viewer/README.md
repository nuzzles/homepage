# Hex / text blog embed

The component takes only `text`, `title`, and `description`:

```liquid
{% include hex-viewer.html text="48 65 6C 6C 6F" title="Hello" description="Five ASCII bytes." %}
```

`text` is a hex byte string, with optional spaces or newlines. The viewer displays those exact bytes and their printable ASCII interpretation. `title` appears above the viewer and names its iframe. `description` is an optional small caption below the embed. The component adds no source subtitle, status subheader, or explanatory caption of its own.

The blog supplies its zlib example through `site.data.halo_theater_hex` in `_data/halo_theater_hex.json`. Other posts can pass literal strings, captured text, or their own page/site data. There is no default sample and no sample URL parameter.

The iframe uses `relative_url`, so it works under the configured blog base path. It receives text and title through messages checked against the parent origin and window; the description is escaped and rendered directly by the include. Its height follows its content. Multiple embeds on a page have independent content, byte selection, and pagination. The shared iframe include used by the Vong demo is unchanged.

This is a read-only viewer. It has no file import, editing, download, or open-in-new-tab controls. It adapts from 16 bytes per row down to eight, four, two, or one according to the embed's available width, with synchronized hex and printable ASCII. Columns retain a minimum readable width, and touch screens get taller byte targets. Other bytes appear as dots. Byte selection links the two columns and shows the offset, hex, decimal, binary, and text values below the table. Arrow keys move between bytes; Page Up / Down navigate pages. Zlib input enables Compressed and Decompressed tabs; other input is shown directly without those tabs.

## Sample provenance

The blog's `_data/halo_theater_hex.json` records the source match, chunk, byte range, compression settings, and SHA-256 checksums. The source is the first 4,096 decompressed bytes of the component registry in the natural-end idle recording from `halo_api/experiments/films/natural-end/01-do-nothing/chunk-000-type-1.bin`.

The data file's `text` is that excerpt recompressed with Python's `zlib.compress(excerpt, level=3)` and encoded as hex, producing 284 bytes starting with `78 5E`. It is not the original downloaded compressed chunk. The description supplied by the post identifies this transformation; the selected compression ratio is not representative of an entire film.

## Decompression

The Decompressed tab uses the browser's `DecompressionStream("deflate")`, which accepts zlib-wrapped DEFLATE and verifies the stream and checksum. In browsers without that API, the original bytes remain readable and requesting decompression shows an error. The component does not substitute a hardcoded decoded sample.

The viewer makes no data requests. Decompression errors are reported without replacing the compressed view. Output is read incrementally with an 8 MiB limit.

Serve the embed through the blog preview rather than opening its HTML via `file://`. A no-JavaScript explanation is provided. The viewer is marked `noindex`; the surrounding article supplies the searchable context. The supplied description uses compact 11px text, while the byte columns retain their readable size.
