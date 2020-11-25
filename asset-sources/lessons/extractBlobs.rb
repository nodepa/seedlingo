#!/usr/bin/env ruby

##############################################################
# Extract blob data from *pretty printed* AnkiApp json files #
##############################################################

# ./extractBlobs.rb fileIn.json

require 'base64'

filename = ARGV[0]

def extractBlobs(filename)
  if File.file?(filename)


    lastID = ''
    lastType = ''
    lastValue = ''
    ln = 0
    index = 0
    File.foreach(filename) do |line|
      ln += 1
      if (line.match?(/"blobs"\s*:\s*\[/))
        puts("\n\n#{ln.to_s.rjust(3, '0')}| New blob:")
        # prep next blob: reset vars
        lastID = ''
        lastType = ''
        lastValue = ''
      else
        if (idMatch = line.match(/"id"\s*:\s*"(\w+)"/))
          lastID = idMatch.captures[0]
        elsif (typeMatch = line.match(/"type"\s*:\s*"(.+)"/))
          lastType = typeMatch.captures[0]
        elsif (valueMatch = line.match(/"value"\s*:\s*"(.+)"/))
          lastValue = valueMatch.captures[0]
        elsif (line.include?('}') && lastID != '' && lastType != '' && lastValue != '')
          # exiting blob scope
          # puts("#{ln.to_s.rjust(3, '0')}| ID: #{lastID}, lastType: #{lastType}, val: #{lastValue[0..10]}")

          index += 1
          ext = 'json'
          ext = 'm4a' if lastType === 'audio/x-m4a'
          ext = 'jpg' if lastType === 'image/jpeg'
          ext = 'png' if lastType === 'image/png'
          puts("#{filename.sub('.json', '')}-#{index.to_s.rjust(2, '0')}-#{lastID}.#{ext}")
          File.open("#{filename.sub('.json', '')}-#{index.to_s.rjust(2, '0')}-#{lastID}.#{ext}", 'w') do |outFile|
            # outFile.write(lastID)
            # outFile.write("\n")
            # outFile.write(lastType)
            # outFile.write("\n")
            outFile.write(Base64.decode64(lastValue))
          end

          lastID = ''
          lastType = ''
          lastValue = ''
        end
      end
    end
  end
end

extractBlobs(filename)
