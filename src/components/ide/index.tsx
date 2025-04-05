"use client"
import React, { useEffect, useState } from "react"

import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

import { Directory, File } from "@/interface/custom/folder-tree/folder-tree"

// import { MonacoEditor } from "../editor"
// import { FileManager } from "../file-manager"
// import { SidebarBody } from "../ide-sidebar"
import { cn } from "@/lib/utils"
import { useIDE } from "@/providers/ide"
import { CircularSpinner } from "@/ui/circular-spinner"
import { CSSTabs } from "@/ui/css-tabs"
import { FileIcon } from "@/ui/file-tree/file-utils"
import { collectSolFiles } from "@/utils"

import Audit from "../audit"
import CompilePage from "../compile-tab"
import Download from "../download"
import GettingStarted from "../getting-started"
import NoFileSelected from "../no-file-selected"
import Plugin from "../plugin"
const MonacoEditor = dynamic(() => import("@/components/editor/").then((mod) => mod.MonacoEditor), {
  ssr: false,
  loading: () => <CircularSpinner />,
})
const SidebarBody = dynamic(() => import("@/components/ide-sidebar").then((mod) => mod.SidebarBody), {
  ssr: false,
  loading: () => <CircularSpinner />,
})
const FileManager = dynamic(() => import("@/components/file-manager").then((mod) => mod.FileManager))

const IDE = () => {
  const { rootDir, selectedFile, setRootDir, setSelectedFile, activeFiles, setActiveFiles, handleFileUpdate } = useIDE()
  const searchparams = useSearchParams()
  const y = searchparams.get("content")
  const handleTabSelect = (file: File) => {
    setSelectedFile(file)
  }
  const [activeTab, setActiveTab] = useState<number>(0)
  // const {compilerErrors,setcompilerErros=r}
  // const [shouldRenderTabs,setshouldRenderTabs]=useState(rootDir && !GettingStarted)

  const handleTabClose = (file: File) => {
    setActiveFiles((prevFiles) => prevFiles?.filter((activeFile) => activeFile.id !== file.id))
    if (selectedFile?.id === file.id && activeFiles && activeFiles.length > 1) setSelectedFile(activeFiles[0])
  }

  useEffect(() => {
    if (y != null) {
      const z: Directory = JSON.parse(y)
      setRootDir(z)
    }
  }, [])

  useEffect(() => {
    if (activeFiles && activeFiles.length == 0) setSelectedFile(undefined)
  }, [activeFiles])
  return (
    <div className="col-span-12 row-span-12 h-full w-full rounded-lg border border-neutral-800 p-2">
      <div className="grid h-full w-full grid-cols-12 grid-rows-12 gap-1 rounded-lg">
        {rootDir ? (
          <CSSTabs
            tabs={[
              {
                id: "0",
                label: "Editor",
              },

              {
                id: "1",
                label: "Compile",
              },
              {
                id: "2",
                label: "Download",
              },
              {
                id: "3",
                label: "Audit",
              },
              {
                id: "4",
                label: "Plugins",
              },
            ]}
            selectedTabIndex={activeTab}
            setSelectedTab={setActiveTab}
          />
        ) : (
          <div></div>
        )}
        <div className="col-span-12 row-span-11 flex h-full gap-1">
          {rootDir ? (
            <>
              <SidebarBody className="justify-between gap-10">
                <div className="no-scroll mt-8 flex h-full flex-1 flex-col gap-2 overflow-y-auto overflow-x-scroll">
                  {activeTab == 0 ? (
                    <FileManager
                      rootDir={rootDir}
                      selectedFile={selectedFile}
                      setRootDir={setRootDir}
                      setSelectedFile={setSelectedFile}
                      activeFiles={activeFiles}
                      setActiveFiles={setActiveFiles}
                    />
                  ) : activeTab == 2 ? (
                    <>
                      <Download
                        contracts={collectSolFiles(rootDir)}
                        rootDir={rootDir}
                      />
                    </>
                  ) : activeTab == 1 ? (
                    <>
                      <CompilePage sources={collectSolFiles(rootDir)} />
                    </>
                  ) : activeTab == 3 ? (
                    <>
                      <Audit selectedFile={selectedFile} />
                    </>
                  ) : activeTab == 4 ? (
                    <>
                      <Plugin
                        rootDir={rootDir}
                        setRootDir={setRootDir}
                        selectedFile={selectedFile}
                      />
                    </>
                  ) : null}
                </div>
              </SidebarBody>
              <div className="w-full rounded-lg md:w-4/5">
                <div className="h-full min-h-8 overflow-y-scroll rounded-lg">
                  <div className="no-scroll flex overflow-x-scroll bg-[#171616] p-1">
                    {activeFiles?.map((file) => (
                      <div
                        key={file.id}
                        className={cn(
                          "relative flex cursor-pointer items-center gap-2 rounded-md border border-neutral-950 px-3 py-1 text-sm font-semibold text-white focus:outline-none",
                          file.id === selectedFile?.id && "bg-[#3c3c3c]"
                        )}
                        onClick={() => {
                          handleTabSelect(file)
                        }}
                      >
                        <FileIcon name={file.name} />
                        {file.name}
                        <button
                          onClick={(e) => {
                            console.log(e)
                            e.stopPropagation()
                            handleTabClose(file)
                          }}
                          className="ml-2 text-gray-400 hover:text-gray-200"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedFile ? (
                    <div
                      key={selectedFile?.id}
                      className="h-full"
                    >
                      <MonacoEditor
                        selectedFile={selectedFile}
                        handleFileUpdate={handleFileUpdate}
                      />
                    </div>
                  ) : (
                    <NoFileSelected />
                  )}
                </div>
                {/* <MonacoEditor selectedFile={selectedFile} /> */}
              </div>
            </>
          ) : (
            <div className="w-full">
              <GettingStarted />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IDE
