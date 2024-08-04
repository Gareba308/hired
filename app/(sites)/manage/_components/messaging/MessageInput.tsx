import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useContext, useRef } from "react";

const ChatInput = () => {

  const textareaRef= useRef<HTMLTextAreaElement>(null)

  return (
    <div className="w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow">
            <div className="relative">
              <Textarea
                placeholder="Enter your question..."
                maxRows={4}
                ref={textareaRef}
                // onChange={handleInputChange}
                // value={message}
                onKeyDown={(e)=> {
                  if(e.key === "Enter" && !e.shiftKey){
                    e.preventDefault()

                    // addMessage()

                    textareaRef.current?.focus()
                  }
                }}
                autoFocus
                className="resize-none  text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                rows={1}
              />

              <Button  
                  className="absolute bottom-1.5 right-[8px]" 
                  onClick={()=>{
                    // addMessage()

                    textareaRef.current?.focus()
                  }}
                  aria-label="send message">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;