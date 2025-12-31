# Docling - Document Processing for Generative AI

⭐ **48,400 GitHub Stars** | 🍴 **3,400 Forks** | 👥 **159 Contributors** | 📜 **MIT License**

## Overview

**Docling** is IBM Research's state-of-the-art document processing library designed specifically for generative AI applications. It transforms the complex task of parsing diverse document formats into a streamlined, Python-based workflow with advanced layout understanding, unified document representation, and seamless AI ecosystem integrations.

### Why Docling?

- **Multi-Format Mastery**: Parse 12+ formats (PDF, DOCX, XLSX, HTML, Images) with consistent output
- **Advanced PDF Intelligence**: Layout analysis, table extraction, reading order, formula parsing
- **AI-First Design**: Purpose-built for RAG pipelines, LangChain, LlamaIndex integrations
- **Privacy-Focused**: Local execution by default—no data leaves your infrastructure
- **Production-Ready**: 48k+ stars, 159 contributors, active development (v2.66.0, Dec 2025)

---

## Key Features

### 📄 Comprehensive Document Understanding

#### Format Support Matrix

| Category | Formats | Special Features |
|----------|---------|------------------|
| **Office Documents** | PDF, DOCX, XLSX, PPTX | Layout preservation, table extraction |
| **Markup** | HTML, Markdown, AsciiDoc | Structure-aware parsing |
| **Data** | CSV, JSON (Docling format) | Structured data handling |
| **Images** | PNG, JPEG, TIFF, BMP, WEBP | OCR processing, layout detection |
| **Specialized** | USPTO XML, JATS XML, WebVTT | Domain-specific parsers |

#### PDF Processing Excellence

Docling's PDF capabilities go far beyond simple text extraction:

**Layout Analysis**:
- Multi-column detection and reading order preservation
- Header/footer identification
- Section hierarchy extraction
- Page-level structure understanding

**Table Extraction**:
- TableFormer ML model (FAST/ACCURATE modes)
- Cell-level precision with merged cell support
- Export to Markdown, HTML, or pandas DataFrames
- Confidence scoring for each extracted cell

**Visual Element Detection**:
- Figure/diagram extraction with bounding boxes
- Image classification (photograph, diagram, chart)
- Caption association
- High-resolution image export

**Code & Formulas**:
- Programming language detection
- Syntax preservation
- Mathematical formula parsing (LaTeX-compatible)
- Code block structure maintenance

### 🤖 AI Ecosystem Integration

#### LangChain Official Extension

```python
from langchain_docling import DoclingLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load with Docling
loader = DoclingLoader(
    file_path="research_paper.pdf",
    export_type="markdown"  # or "json" for lossless
)
documents = loader.load()

# Standard LangChain workflow
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000)
chunks = text_splitter.split_documents(documents)
```

**Benefits**:
- Drop-in replacement for standard LangChain loaders
- Better structure preservation than basic PDF loaders
- Table and figure metadata in document metadata
- Configurable export formats (Markdown, JSON)

#### LlamaIndex Integration

```python
from llama_index.readers.docling import DoclingReader
from llama_index.node_parser.docling import DoclingNodeParser

# Docling Reader for document loading
reader = DoclingReader(export_type="json")  # Lossless
documents = reader.load_data(file_path="manual.pdf")

# Docling Node Parser for chunking
node_parser = DoclingNodeParser()
nodes = node_parser.get_nodes_from_documents(documents)
```

**Components**:
- **DoclingReader**: Loads documents with full structure preservation
- **DoclingNodeParser**: Splits into nodes respecting document boundaries
- **Metadata Enrichment**: Automatic section headers, page numbers, element types

#### Model Context Protocol (MCP) Server

```bash
# Install MCP server
pip install docling-mcp-server

# Start server
docling-mcp-server --port 3000
```

**Claude Desktop Configuration**:
```json
{
  "mcpServers": {
    "docling": {
      "command": "docling-mcp-server",
      "args": ["--port", "3000"]
    }
  }
}
```

**Use Cases**:
- Parse documents on-demand for AI agents
- Extract structured data from PDFs in conversations
- Convert documents to Markdown for further processing
- Multi-format document workflows

### 🚀 Production Features

#### Local-First Architecture

**Privacy & Security**:
```python
# Default: 100% local processing
converter = DocumentConverter()
result = converter.convert("sensitive_document.pdf")
# No data leaves your infrastructure
```

**Offline/Air-Gapped Deployment**:
```bash
# Prefetch ML models
docling-tools models download

# Set custom artifacts path
export DOCLING_ARTIFACTS_PATH=/secure/storage/models

# Now works completely offline
python process_documents.py
```

**Benefits**:
- GDPR/HIPAA compliant (data never transmitted)
- Works in restricted networks
- Consistent performance (no API latency)
- No per-document API costs

#### Performance Optimization

**Parallel Processing**:
```python
import os
from docling.document_converter import DocumentConverter

# Configure CPU threads
os.environ["OMP_NUM_THREADS"] = "16"  # Use 16 cores

# Batch processing
converter = DocumentConverter()

# Process files in parallel (application-level)
from concurrent.futures import ProcessPoolExecutor

def process_file(file_path):
    return converter.convert(file_path)

with ProcessPoolExecutor(max_workers=4) as executor:
    results = executor.map(process_file, file_paths)
```

**Resource Constraints**:
```python
# Prevent OOM on large documents
converter = DocumentConverter(
    max_file_size=100_000_000,  # 100 MB limit
    max_num_pages=500            # First 500 pages only
)
```

**Model Caching**:
- Models loaded once per process
- Reused across multiple documents
- ~2-5 second overhead on first document
- Subsequent documents: negligible overhead

---

## Installation & Setup

### Quick Start

```bash
# Install Docling
pip install docling

# Verify installation
python -c "import docling; print(f'Docling {docling.__version__} installed')"

# Optional: Prefetch models (recommended for production)
docling-tools models download
```

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Python** | 3.9+ | 3.11+ |
| **RAM** | 4 GB | 8+ GB (for large PDFs) |
| **Disk Space** | 2 GB (models) | 5+ GB (caching) |
| **CPU** | 2 cores | 4+ cores (parallel processing) |
| **GPU** | Not required | Optional (CUDA for VLM models) |

### Platform Support

- **Operating Systems**: macOS, Linux, Windows
- **Architectures**: x86_64, arm64 (Apple Silicon, ARM servers)
- **Cloud**: AWS, GCP, Azure (container-based deployment)
- **Edge**: IoT devices, embedded systems (with resource constraints)

### Dependencies

**Core Dependencies** (auto-installed):
- `pydantic>=2.0` - Document structure validation
- `pymupdf` - PDF processing backend
- `pillow` - Image handling
- `beautifulsoup4` - HTML parsing
- `lxml` - XML processing

**Optional Dependencies**:
```bash
# For OCR support
pip install docling[ocr]

# For all features
pip install docling[all]
```

---

## Complete Usage Guide

### Basic Document Conversion

#### Single Document

```python
from docling.document_converter import DocumentConverter

# Initialize converter (loads models once)
converter = DocumentConverter()

# Convert document
result = converter.convert("report.pdf")

# Access Docling Document
doc = result.document

# Export to Markdown
markdown = doc.export_to_markdown()
print(markdown)

# Export to JSON (lossless)
json_data = doc.export_to_dict()

# Export to HTML
html = doc.export_to_html()

# Export to plain text
text = doc.export_to_text()
```

#### Batch Processing

```python
from docling.document_converter import DocumentConverter
from pathlib import Path

converter = DocumentConverter()

# Process directory
input_dir = Path("documents/")
output_dir = Path("processed/")
output_dir.mkdir(exist_ok=True)

for file_path in input_dir.iterdir():
    if file_path.suffix in [".pdf", ".docx", ".xlsx", ".pptx"]:
        try:
            result = converter.convert(str(file_path))

            # Save as Markdown
            output_file = output_dir / f"{file_path.stem}.md"
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(result.document.export_to_markdown())

            print(f"✅ Converted: {file_path.name}")

        except Exception as e:
            print(f"❌ Failed: {file_path.name} - {e}")
```

### Advanced PDF Configuration

#### Complete Pipeline Customization

```python
from docling.document_converter import DocumentConverter
from docling.datamodel.pipeline_options import (
    PdfPipelineOptions,
    TableFormerMode,
    OcrOptions
)

# Configure PDF pipeline
pdf_options = PdfPipelineOptions()

# Table extraction
pdf_options.do_table_structure = True
pdf_options.table_structure_options.mode = TableFormerMode.ACCURATE
pdf_options.do_cell_matching = True

# OCR for scanned PDFs
pdf_options.do_ocr = True
pdf_options.ocr_options = OcrOptions(
    use_gpu=False,  # Set to True if CUDA available
    lang="eng+fra"  # English + French
)

# Image extraction
pdf_options.generate_page_images = True
pdf_options.generate_picture_images = True

# Code detection
pdf_options.do_code_enrichment = True

# Formula extraction
pdf_options.do_formula_enrichment = True

# Initialize converter
converter = DocumentConverter(pipeline_options=pdf_options)

# Convert with all features
result = converter.convert("technical_manual.pdf")

# Access structured content
print(f"Tables: {len(result.document.tables)}")
print(f"Figures: {len(result.document.pictures)}")
print(f"Code blocks: {len(result.document.code_blocks)}")
print(f"Formulas: {len(result.document.formulas)}")
```

#### Table Extraction Modes

**FAST Mode** (Default):
```python
pdf_options.table_structure_options.mode = TableFormerMode.FAST
```
- **Speed**: ~2-3 seconds per page with tables
- **Use Case**: Simple tables, spreadsheets, data tables
- **Accuracy**: ~85-90% for standard tables

**ACCURATE Mode**:
```python
pdf_options.table_structure_options.mode = TableFormerMode.ACCURATE
```
- **Speed**: ~5-10 seconds per page with tables
- **Use Case**: Complex tables, merged cells, nested headers
- **Accuracy**: ~95-98% for complex tables

**Example: Extract Tables to DataFrames**:
```python
import pandas as pd

result = converter.convert("financial_report.pdf")

# Convert all tables to pandas DataFrames
for i, table in enumerate(result.document.tables):
    df = table.to_dataframe()
    df.to_csv(f"table_{i}.csv", index=False)
    print(f"Table {i}: {df.shape[0]} rows x {df.shape[1]} columns")
```

### Document Structure Access

#### Navigating the Docling Document

```python
result = converter.convert("research_paper.pdf")
doc = result.document

# Document metadata
print(f"Title: {doc.name}")
print(f"Pages: {len(doc.pages)}")
print(f"File size: {doc.file_info.size} bytes")

# Iterate through elements
for element in doc.elements:
    print(f"Type: {element.type}")
    print(f"Text: {element.text[:100]}...")
    print(f"Page: {element.page}")
    print(f"Bounding box: {element.bbox}")
    print("---")

# Access specific element types
for heading in doc.headings:
    print(f"H{heading.level}: {heading.text}")

for paragraph in doc.paragraphs:
    print(f"Paragraph: {paragraph.text[:50]}...")

for list_item in doc.list_items:
    print(f"- {list_item.text}")

for code_block in doc.code_blocks:
    print(f"Language: {code_block.language}")
    print(f"Code:\n{code_block.code}")

for formula in doc.formulas:
    print(f"Formula: {formula.latex}")
```

#### Confidence Scores

```python
# Check extraction confidence
for element in doc.elements:
    if hasattr(element, 'confidence'):
        if element.confidence < 0.8:
            print(f"Low confidence element: {element.text[:50]}")
            print(f"Confidence: {element.confidence:.2%}")
```

### Export Format Customization

#### Markdown Export Options

```python
# Embedded images (Base64)
markdown_embedded = doc.export_to_markdown(image_mode="embedded")

# Referenced images (saves to files)
markdown_referenced = doc.export_to_markdown(
    image_mode="referenced",
    image_dir="./images"
)

# Custom Markdown flavors
markdown_github = doc.export_to_markdown(flavor="github")
markdown_commonmark = doc.export_to_markdown(flavor="commonmark")
```

#### HTML Export Options

```python
# With inline CSS
html_styled = doc.export_to_html(
    include_styles=True,
    custom_css="""
        body { font-family: 'Georgia', serif; }
        table { border-collapse: collapse; width: 100%; }
        code { background-color: #f4f4f4; padding: 2px 4px; }
    """
)

# Minimal HTML (no styles)
html_minimal = doc.export_to_html(include_styles=False)

# With embedded images
html_images = doc.export_to_html(
    image_mode="embedded",
    include_styles=True
)
```

#### JSON Export (Lossless Serialization)

```python
import json

# Complete document structure
json_data = doc.export_to_dict()

# Save to file
with open("document_structure.json", "w") as f:
    json.dump(json_data, f, indent=2)

# Includes:
# - Full layout information (bounding boxes)
# - Reading order
# - Element hierarchy
# - Confidence scores
# - Metadata
# - Page-level details
```

### RAG Pipeline Integration

#### LangChain RAG Example

```python
from langchain_docling import DoclingLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA

# Step 1: Load documents with Docling
loader = DoclingLoader(
    file_path="company_handbook.pdf",
    export_type="markdown"
)
documents = loader.load()

# Step 2: Split into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""]
)
splits = text_splitter.split_documents(documents)

# Step 3: Create embeddings and vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(splits, embeddings)

# Step 4: Create QA chain
llm = ChatOpenAI(model="gpt-4", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3})
)

# Step 5: Query
question = "What is the vacation policy?"
answer = qa_chain.run(question)
print(answer)
```

#### LlamaIndex RAG Example

```python
from llama_index.readers.docling import DoclingReader
from llama_index.node_parser.docling import DoclingNodeParser
from llama_index.core import VectorStoreIndex, Settings
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding

# Configure LlamaIndex
Settings.llm = OpenAI(model="gpt-4")
Settings.embed_model = OpenAIEmbedding()

# Load documents
reader = DoclingReader(export_type="json")  # Lossless
documents = reader.load_data(file_path="technical_docs.pdf")

# Parse into nodes (respects document structure)
node_parser = DoclingNodeParser()
nodes = node_parser.get_nodes_from_documents(documents)

# Build index
index = VectorStoreIndex(nodes)

# Query
query_engine = index.as_query_engine(similarity_top_k=5)
response = query_engine.query("How do I configure SSL certificates?")
print(response)

# Chat mode
chat_engine = index.as_chat_engine()
response = chat_engine.chat("What are the deployment options?")
print(response)
```

### Document Chunking Strategies

#### Hybrid Chunking

```python
from docling.chunking import HybridChunker

# Configure chunker
chunker = HybridChunker(
    chunk_size=1000,          # Target size in characters
    chunk_overlap=200,        # Overlap between chunks
    respect_boundaries=True,  # Don't split across sections
    min_chunk_size=100,       # Minimum chunk size
    max_chunk_size=1500       # Maximum chunk size
)

# Chunk document
chunks = chunker.chunk(result.document)

for i, chunk in enumerate(chunks):
    print(f"\n=== Chunk {i} ===")
    print(f"Text: {chunk.text[:100]}...")
    print(f"Size: {len(chunk.text)} chars")
    print(f"Page: {chunk.metadata.get('page')}")
    print(f"Section: {chunk.metadata.get('section')}")
```

**Benefits of Hybrid Chunking**:
- Respects document structure (paragraphs, sections)
- Preserves context (doesn't split mid-sentence)
- Maintains metadata (page numbers, headings)
- Configurable overlap for better retrieval

---

## Advanced Use Cases

### Multi-Format Document Pipeline

```python
from docling.document_converter import DocumentConverter
from pathlib import Path
import json

class DocumentProcessor:
    def __init__(self, output_dir="processed"):
        self.converter = DocumentConverter()
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

    def process_document(self, file_path):
        """Process single document with error handling"""
        file_path = Path(file_path)

        try:
            # Convert
            result = self.converter.convert(str(file_path))

            # Create output subdirectory
            output_subdir = self.output_dir / file_path.stem
            output_subdir.mkdir(exist_ok=True)

            # Save Markdown
            md_path = output_subdir / f"{file_path.stem}.md"
            with open(md_path, "w") as f:
                f.write(result.document.export_to_markdown())

            # Save JSON structure
            json_path = output_subdir / f"{file_path.stem}.json"
            with open(json_path, "w") as f:
                json.dump(result.document.export_to_dict(), f, indent=2)

            # Extract tables
            for i, table in enumerate(result.document.tables):
                table_path = output_subdir / f"table_{i}.csv"
                table.to_dataframe().to_csv(table_path, index=False)

            # Extract images
            for i, picture in enumerate(result.document.pictures):
                img_path = output_subdir / f"figure_{i}.png"
                picture.save(img_path)

            return {
                "status": "success",
                "file": file_path.name,
                "tables": len(result.document.tables),
                "images": len(result.document.pictures),
                "pages": len(result.document.pages)
            }

        except Exception as e:
            return {
                "status": "error",
                "file": file_path.name,
                "error": str(e)
            }

    def process_directory(self, input_dir):
        """Process all documents in directory"""
        input_dir = Path(input_dir)
        results = []

        for file_path in input_dir.rglob("*"):
            if file_path.suffix in [".pdf", ".docx", ".xlsx", ".pptx", ".html"]:
                result = self.process_document(file_path)
                results.append(result)
                print(f"{'✅' if result['status'] == 'success' else '❌'} {result['file']}")

        return results

# Usage
processor = DocumentProcessor(output_dir="processed_docs")
results = processor.process_directory("input_docs/")

# Summary
success = sum(1 for r in results if r['status'] == 'success')
print(f"\nProcessed {len(results)} documents: {success} successful, {len(results) - success} failed")
```

### Streaming Large Documents

```python
from docling.document_converter import DocumentConverter, DocumentStream
from io import BytesIO
import requests

def process_remote_pdf(url):
    """Stream PDF from URL without saving to disk"""

    # Download PDF to memory
    response = requests.get(url, stream=True)
    pdf_bytes = BytesIO(response.content)

    # Create document stream
    doc_stream = DocumentStream(
        name=url.split("/")[-1],
        stream=pdf_bytes
    )

    # Convert
    converter = DocumentConverter()
    result = converter.convert(doc_stream)

    return result.document.export_to_markdown()

# Example
markdown = process_remote_pdf("https://example.com/whitepaper.pdf")
```

### Custom Backend Configuration

```python
from docling.document_converter import DocumentConverter
from docling.backend.pdf_backend import PyPdfiumBackend, DoclingParseBackend

# Use specific PDF backend
converter_pypdfium = DocumentConverter(
    allowed_formats=["pdf"],
    format_options={"pdf": PyPdfiumBackend}
)

# Or use Docling's native parser (faster, less accurate)
converter_docling = DocumentConverter(
    allowed_formats=["pdf"],
    format_options={"pdf": DoclingParseBackend}
)

# Compare performance
import time

for backend_name, converter in [
    ("PyPdfium", converter_pypdfium),
    ("DoclingParse", converter_docling)
]:
    start = time.time()
    result = converter.convert("benchmark.pdf")
    duration = time.time() - start
    print(f"{backend_name}: {duration:.2f}s")
```

---

## Production Deployment

### Docker Containerization

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Docling
RUN pip install --no-cache-dir docling[all]

# Prefetch models
RUN docling-tools models download

# Copy application
COPY app.py .

# Run
CMD ["python", "app.py"]
```

**Build and Run**:
```bash
docker build -t docling-processor .
docker run -v $(pwd)/documents:/app/documents docling-processor
```

### FastAPI Service

```python
from fastapi import FastAPI, UploadFile, File
from docling.document_converter import DocumentConverter, DocumentStream
from io import BytesIO

app = FastAPI()
converter = DocumentConverter()

@app.post("/convert")
async def convert_document(
    file: UploadFile = File(...),
    export_format: str = "markdown"
):
    # Read file
    contents = await file.read()
    stream = DocumentStream(name=file.filename, stream=BytesIO(contents))

    # Convert
    result = converter.convert(stream)

    # Export
    if export_format == "markdown":
        output = result.document.export_to_markdown()
    elif export_format == "json":
        output = result.document.export_to_dict()
    elif export_format == "html":
        output = result.document.export_to_html()
    else:
        output = result.document.export_to_text()

    return {
        "filename": file.filename,
        "pages": len(result.document.pages),
        "format": export_format,
        "content": output
    }

# Run: uvicorn app:app --host 0.0.0.0 --port 8000
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docling-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: docling
  template:
    metadata:
      labels:
        app: docling
    spec:
      containers:
      - name: docling
        image: your-registry/docling-processor:latest
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        env:
        - name: OMP_NUM_THREADS
          value: "4"
        volumeMounts:
        - name: models
          mountPath: /root/.cache/docling/models
      volumes:
      - name: models
        persistentVolumeClaim:
          claimName: docling-models-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: docling-service
spec:
  selector:
    app: docling
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

---

## Troubleshooting

### Common Issues

#### Model Download Failures

**Symptom**: `ModuleNotFoundError` or `FileNotFoundError` for models

**Solution**:
```bash
# Manual model download
docling-tools models download

# Check model cache
ls ~/.cache/docling/models

# Set custom cache location
export DOCLING_ARTIFACTS_PATH=/custom/path
docling-tools models download
```

#### Memory Errors with Large PDFs

**Symptom**: `MemoryError` or process killed

**Solutions**:
```python
# 1. Limit pages processed
converter = DocumentConverter(max_num_pages=100)

# 2. Limit file size
converter = DocumentConverter(max_file_size=50_000_000)  # 50 MB

# 3. Process in batches
for page_range in [(0, 50), (50, 100), (100, 150)]:
    # Process page range
    pass

# 4. Reduce thread count
import os
os.environ["OMP_NUM_THREADS"] = "2"
```

#### Table Extraction Inaccuracies

**Symptom**: Tables not detected or poorly formatted

**Solutions**:
```python
# 1. Use ACCURATE mode
pipeline_options.table_structure_options.mode = TableFormerMode.ACCURATE

# 2. Enable cell matching
pipeline_options.do_cell_matching = True

# 3. Adjust confidence threshold
# (Check table.confidence attribute)

# 4. Try different PDF backend
from docling.backend.pdf_backend import PyPdfiumBackend
converter = DocumentConverter(format_options={"pdf": PyPdfiumBackend})
```

#### OCR Not Working

**Symptom**: Text not extracted from scanned PDFs

**Solutions**:
```python
# 1. Explicitly enable OCR
pipeline_options.do_ocr = True

# 2. Install OCR dependencies
# pip install docling[ocr]

# 3. Specify language
pipeline_options.ocr_options = OcrOptions(lang="eng")

# 4. Check GPU availability (faster)
pipeline_options.ocr_options.use_gpu = True  # Requires CUDA
```

#### Performance Issues

**Symptom**: Slow processing times

**Solutions**:
```bash
# 1. Increase CPU threads
export OMP_NUM_THREADS=16

# 2. Use FAST table mode
pipeline_options.table_structure_options.mode = TableFormerMode.FAST

# 3. Disable unnecessary features
pipeline_options.do_code_enrichment = False
pipeline_options.do_formula_enrichment = False

# 4. Prefetch models (avoid download delay)
docling-tools models download

# 5. Use faster PDF backend
format_options={"pdf": DoclingParseBackend}  # Less accurate, faster
```

---

## Best Practices

### Performance Optimization
1. **Prefetch models** in production environments
2. **Adjust thread count** based on CPU cores (OMP_NUM_THREADS)
3. **Use FAST mode** for simple tables, ACCURATE for complex
4. **Batch process** documents to reuse loaded models
5. **Cache results** to avoid reprocessing unchanged documents

### Quality Optimization
1. **Use JSON export** for lossless serialization
2. **Enable OCR** for scanned documents
3. **Check confidence scores** and flag low-confidence extractions
4. **Validate table structure** before downstream processing
5. **Preserve metadata** (page numbers, headings) for traceability

### Privacy & Security
1. **Default to local execution** (no remote services)
2. **Explicitly opt-in** to remote services when needed
3. **Use air-gapped deployments** for sensitive data
4. **Validate input files** before processing
5. **Sanitize output** before exposing to users

### Integration Guidelines
1. **Use LangChain/LlamaIndex loaders** for RAG pipelines
2. **Chunk documents** respecting structure boundaries
3. **Include metadata** in embeddings for better retrieval
4. **Handle errors gracefully** with fallback strategies
5. **Monitor extraction quality** with confidence scores

---

## Conclusion

Docling transforms document processing from a complex, error-prone task into a streamlined, production-ready workflow. Whether you're building RAG systems, extracting data from PDFs, or integrating with AI frameworks, Docling provides the tools, performance, and reliability needed for modern AI applications.

**Get Started Today**:
```bash
pip install docling
python -c "from docling.document_converter import DocumentConverter; print('Ready!')"
```

Join the 48,400+ developers leveraging Docling for document processing excellence.

---

**Last Updated**: December 30, 2025
**Documentation Version**: 1.0
**Docling Version**: 2.66.0
