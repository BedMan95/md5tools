"use client"

import { useState, useRef, type ChangeEvent } from 'react'
import { md5 } from 'js-md5'
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MD5Tool() {
    const [textInput, setTextInput] = useState('')
    const [textHash, setTextHash] = useState('')
    const [fileHash, setFileHash] = useState('')
    const [fileName, setFileName] = useState('')
    const [compareHash1, setCompareHash1] = useState('')
    const [compareHash2, setCompareHash2] = useState('')
    const [matchResult, setMatchResult] = useState<boolean | null>(null)
    const [copied, setCopied] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const computeTextHash = () => {
        if (!textInput) return
        const hash = md5(textInput)
        setTextHash(hash)
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setFileHash('Computing...')

        try {
            const buffer = await file.arrayBuffer()
            const hash = md5(buffer)
            setFileHash(hash)
        } catch (err) {
            console.error(err)
            setFileHash('Error computing hash')
        }
    }

    const compareHashes = () => {
        if (!compareHash1 || !compareHash2) {
            setMatchResult(null)
            return
        }
        setMatchResult(compareHash1.trim().toLowerCase() === compareHash2.trim().toLowerCase())
    }

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(id)
            setTimeout(() => setCopied(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const CopyButton = ({ text, id }: { text: string; id: string }) => (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(text, id)}
            disabled={!text}
        >
            {copied === id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
    )

    const [lookupHash, setLookupHash] = useState('')
    const [lookupResult, setLookupResult] = useState<string | null>(null)
    const [lookupLoading, setLookupLoading] = useState(false)
    const [lookupError, setLookupError] = useState<string | null>(null)

    const handleReverseLookup = async () => {
        const hash = lookupHash.trim().toLowerCase()

        if (!hash || hash.length !== 32 || !/^[0-9a-f]{32}$/.test(hash)) {
            setLookupError("Please enter a valid 32-character hexadecimal MD5 hash")
            setLookupResult(null)
            return
        }

        setLookupLoading(true)
        setLookupError(null)
        setLookupResult(null)

        const res = await fetch(`/api/md5/reverse/${hash}`);
        const data = await res.json();

        if (data.error) {
            setLookupError(data.error);
            setLookupLoading(false);
        } else if (data.success && data.plaintext) {
            setLookupResult(data.plaintext);
            setLookupLoading(false);
        } else {
            setLookupError("Plaintext not found");
            setLookupLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-10 md:max-w-full md:p-0 md:flex md:flex-row md:space-x-8 md:items-center">
            <div className="px-7">
                <h1 className="text-4xl font-bold mb-2">MD5 Tools</h1>
                <p className="text-muted-foreground mb-8">Reverse, Generate and compare MD5 hashes — all in your browser</p>
            </div>
            <div className="md:w-1/2 md:pr-8">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Reverse MD5 Lookup</CardTitle>
                        <CardDescription>
                            Try to find original text from MD5 hash (works best for common passwords/phrases)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="lookup-hash" className="text-sm">MD5 Hash to crack</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="lookup-hash"
                                    placeholder="5f4dcc3b5aa765d61d8327deb882cf99"
                                    value={lookupHash}
                                    onChange={(e) => setLookupHash(e.target.value)}
                                    className="font-mono text-sm"
                                    maxLength={32}
                                />
                                <Button
                                    onClick={handleReverseLookup}
                                    disabled={lookupLoading || !lookupHash.trim()}
                                    size="sm"
                                >
                                    {lookupLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Looking up...
                                        </>
                                    ) : (
                                        "Crack"
                                    )}
                                </Button>
                            </div>
                        </div>

                        {lookupError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{lookupError}</AlertDescription>
                            </Alert>
                        )}

                        {lookupResult && (
                            <Alert variant="default" className="bg-green-50 dark:bg-green-950 border-green-200">
                                <Check className="h-4 w-4 text-green-600" />
                                <AlertTitle>Found!</AlertTitle>
                                <AlertDescription className="mt-2">
                                    <div className="font-mono text-lg break-all bg-background p-3 rounded border">
                                        {lookupResult}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                        Uses public rainbow table services • No guarantee of success
                    </CardFooter>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Compare Hashes</CardTitle>
                        <CardDescription>Check if two MD5 hashes match (case-insensitive)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="hash1">Hash 1</Label>
                                <Input
                                    id="hash1"
                                    placeholder="Paste hash here..."
                                    value={compareHash1}
                                    onChange={(e) => setCompareHash1(e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hash2">Hash 2</Label>
                                <Input
                                    id="hash2"
                                    placeholder="Paste hash here..."
                                    value={compareHash2}
                                    onChange={(e) => setCompareHash2(e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        <Button onClick={compareHashes}>Compare</Button>

                        {matchResult !== null && (
                            <Alert variant={matchResult ? "default" : "destructive"}>
                                {matchResult ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        <AlertTitle>Match!</AlertTitle>
                                        <AlertDescription>The two hashes are identical.</AlertDescription>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>No match</AlertTitle>
                                        <AlertDescription>The hashes are different.</AlertDescription>
                                    </>
                                )}
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="md:w-1/2 md:pl-8">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Text to MD5</CardTitle>
                        <CardDescription>Enter any text to generate its MD5 hash</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="text-input">Input Text</Label>
                            <Textarea
                                id="text-input"
                                placeholder="Paste or type text here..."
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                        <Button onClick={computeTextHash}>Generate MD5</Button>

                        {textHash && (
                            <div className="mt-4 space-y-2">
                                <Label>MD5 Hash</Label>
                                <div className="flex items-center gap-2">
                                    <Input value={textHash} readOnly className="font-mono" />
                                    <CopyButton text={textHash} id="text" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>File to MD5</CardTitle>
                        <CardDescription>Upload a file to compute its MD5 checksum</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Button onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" /> Choose File
                        </Button>

                        {fileName && (
                            <div className="mt-4 space-y-2">
                                <div className="text-sm">File: <strong>{fileName}</strong></div>
                                <div className="flex items-center gap-2">
                                    <Input value={fileHash} readOnly className="font-mono" />
                                    <CopyButton text={fileHash} id="file" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}